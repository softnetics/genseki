import { type NextRequest } from 'next/server'
import { createRouter } from 'radix3'

import {
  type ApiRoute,
  type ApiRouter,
  type GensekiCore,
  isApiRoute,
  recordifyApiRouter,
} from '@genseki/react'

interface RouteData {
  route: ApiRoute
  methodName: string
}

function isGensekiResponse(value: unknown): value is { status: number; body: any } {
  if (typeof value === 'object' && value !== null) {
    return 'status' in value && 'body' in value
  }
  return false
}

function extractHeaders(headers: Headers) {
  const headersRecord: Record<string, string> = {}
  headers.forEach((value, key) => {
    headersRecord[key] = value
  })
  return headersRecord
}

function extractSearchParams(searchParams: URLSearchParams) {
  const params: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

async function makeApiRoute(
  req: NextRequest,
  route: ApiRoute,
  pathParams: Record<string, string> | undefined
) {
  const reqHeaders = extractHeaders(req.headers)
  const reqSearchParams = extractSearchParams(req.nextUrl.searchParams)

  let rawBody: string | undefined = undefined
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    try {
      rawBody = await req.text()
    } catch {
      rawBody = undefined
    }
  }

  let body: any = {}
  const ct = (req.headers.get('content-type') || '').toLowerCase()
  if (rawBody) {
    if (!ct.includes('application/json')) {
      return Response.json({ message: 'Content-Type must be application/json' }, { status: 400 })
    }

    try {
      body = JSON.parse(rawBody)
    } catch {
      return Response.json({ message: 'Invalid JSON request body' }, { status: 400 })
    }
  }

  const response = new Response(null, {
    headers: { 'Content-Type': 'application/json' },
  })

  try {
    const rawResponse = await route.handler(
      {
        headers: reqHeaders,
        pathParams: pathParams,
        query: reqSearchParams,
        body,
      },
      { request: req, response, rawBody }
    )

    if (response.headers.get('Content-Type') === 'application/json') {
      return Response.json(rawResponse, {
        status: rawResponse.status,
        headers: response.headers,
      })
    }
    return new Response(rawResponse as any, {
      status: rawResponse.status,
      headers: response.headers,
    })
  } catch (error: unknown) {
    console.error('Error in API route:', error)
    if (isGensekiResponse(error)) {
      return Response.json(
        {
          status: error?.status ?? 500,
          body: {
            ...error?.body,
            message: error?.body?.message ?? 'Internal Server Error',
          },
        },
        { status: error?.status ?? 500 }
      )
    }

    return Response.json(
      {
        status: 500,
        body: error,
      },
      { status: 500 }
    )
  }
}

async function lookupRoute(
  radixRouter: ReturnType<typeof createRouter<RouteData>>,
  req: NextRequest
) {
  const match = radixRouter.lookup(req.nextUrl.pathname)
  if (!match) return Response.json({ message: 'Not Found' }, { status: 404 })
  const pathParams = match.params
  const route = match.route
  return makeApiRoute(req, route, pathParams)
}

interface ApiResourceRouterOptions {
  pathPrefix?: string
}

export function createApiResourceRouter(core: GensekiCore, options: ApiResourceRouterOptions = {}) {
  const pathPrefix = options.pathPrefix ?? ''

  const flatApiRouter = recordifyApiRouter(core.api)

  const radixGetRouter = createRouter<RouteData>({
    routes: createRadixRoutesFromApiRouter(flatApiRouter, 'GET', { ...options, pathPrefix }),
  })
  const radixPostRouter = createRouter<RouteData>({
    routes: createRadixRoutesFromApiRouter(flatApiRouter, 'POST', { ...options, pathPrefix }),
  })
  const radixPutRouter = createRouter<RouteData>({
    routes: createRadixRoutesFromApiRouter(flatApiRouter, 'PUT', { ...options, pathPrefix }),
  })
  const radixPatchRouter = createRouter<RouteData>({
    routes: createRadixRoutesFromApiRouter(flatApiRouter, 'PATCH', { ...options, pathPrefix }),
  })
  const radixDeleteRouter = createRouter<RouteData>({
    routes: createRadixRoutesFromApiRouter(flatApiRouter, 'DELETE', { ...options, pathPrefix }),
  })

  return {
    GET: async (req: NextRequest) => {
      return lookupRoute(radixGetRouter, req)
    },
    POST: async (req: NextRequest) => {
      return lookupRoute(radixPostRouter, req)
    },
    PUT: async (req: NextRequest) => {
      return lookupRoute(radixPutRouter, req)
    },
    DELETE: async (req: NextRequest) => {
      return lookupRoute(radixDeleteRouter, req)
    },
    PATCH: async (req: NextRequest) => {
      return lookupRoute(radixPatchRouter, req)
    },
  }
}

interface CreateRadixRoutesFromApiRouterOptions {
  pathPrefix: string
}

function createRadixRoutesFromApiRouter(
  apiRoutes: ApiRouter,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  options: CreateRadixRoutesFromApiRouterOptions
): Record<string, RouteData> {
  const filteredRoutes = Object.entries(apiRoutes).filter(([, router]) => {
    if (isApiRoute(router)) {
      return router.schema.method === method
    }
  })

  const routes = filteredRoutes.flatMap(([methodName, router]) => {
    if (isApiRoute(router)) {
      return [
        [`${options.pathPrefix}${router.schema.path}`, { route: router, methodName }],
      ] as const
    }
    const nestedRoutes = Object.entries(
      createRadixRoutesFromApiRouter(router, method, options)
    ).map(
      ([path, route]) =>
        [path, { route: route.route, methodName: `${methodName}.${route.methodName}` }] as const
    )
    return nestedRoutes
  })

  return Object.fromEntries(routes)
}
