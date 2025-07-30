import { type NextRequest } from 'next/server'
import { createRouter } from 'radix3'

import { type ApiRoute, type ApiRouter, type GensekiCore, isApiRoute } from '@genseki/react'

import type { GensekiApiOptions } from '../../react/src/core/config'

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

  // TODO: This logic might not able to handle form data or x-www-form-urlencoded requests correctly
  let body: any = {}
  try {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
      body = undefined
    } else {
      body = await req.json()
    }
  } catch {
    // If the request body is not JSON or empty, we will not parse it
    // This is useful for file uploads or plain text requests
  }

  try {
    const rawResponse = await route.handler(
      {
        headers: reqHeaders,
        pathParams: pathParams,
        query: reqSearchParams,
        body,
      },
      req
    )

    return new Response(JSON.stringify(rawResponse) as any, {
      status: rawResponse.status,
      headers: {
        'Content-Type': 'application/json',
        ...rawResponse.headers,
      },
    })
  } catch (error: any) {
    console.error('Error in API route:', error)
    return Response.json(
      {
        status: error.status || 500,
        body: {
          message: error.message || 'Internal Server Error',
        },
      },
      { status: error.status || 500 }
    )
  }
}

async function lookupRoute(radixRouter: ReturnType<typeof createRouter>, req: NextRequest) {
  const match = radixRouter.lookup(req.nextUrl.pathname)
  if (!match) return Response.json({ message: 'Not Found' }, { status: 404 })
  const pathParams = match.params
  const route = match.route as ApiRoute<any>
  return makeApiRoute(req, route, pathParams)
}

export function createApiResourceRouter(core: GensekiCore, options?: Partial<GensekiApiOptions>) {
  const defaultOptions: GensekiApiOptions = {
    apiPrefix: '/api',
  }

  const mergeOptions = { ...defaultOptions, ...options }

  const apiRouter = core.api

  const radixGetRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(apiRouter, 'GET', mergeOptions),
  })
  const radixPostRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(apiRouter, 'POST', mergeOptions),
  })
  const radixPutRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(apiRouter, 'PUT', mergeOptions),
  })
  const radixPatchRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(apiRouter, 'PATCH', mergeOptions),
  })
  const radixDeleteRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(apiRouter, 'DELETE', mergeOptions),
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

function createRadixRoutesFromApiRouter(
  apiRoutes: ApiRouter,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  options: GensekiApiOptions
): Record<string, { route: ApiRoute; methodName: string }> {
  const { apiPrefix: prefix } = options
  const filteredRoutes = Object.entries(apiRoutes).filter(([, router]) => {
    if (isApiRoute(router)) {
      return router.schema.method === method
    }

    return Object.values(router).some(
      (nestedRoute) => isApiRoute(nestedRoute) && nestedRoute.schema.method === method
    )
  })

  const routes = filteredRoutes.flatMap(([methodName, router]) => {
    if (isApiRoute(router)) {
      return [[`${prefix}${router.schema.path}`, { route: router, methodName }]] as const
    }
    const nestedRoutes = Object.entries(
      createRadixRoutesFromApiRouter(router, method, options)
    ).map(
      ([path, routeInfo]) =>
        [
          path,
          {
            route: routeInfo.route,
            methodName: `${methodName}.${routeInfo.methodName}`,
          },
        ] as const
    )

    return nestedRoutes
  })

  return Object.fromEntries(routes)
}
