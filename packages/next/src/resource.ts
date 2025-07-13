import { type NextRequest } from 'next/server'
import { createRouter } from 'radix3'

import {
  type ApiRoute,
  type ApiRouter,
  type ApiRouteSchema,
  type GensekiCore,
  isApiRoute,
} from '@genseki/react'

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

export function createApiResourceRouter(core: GensekiCore) {
  const apiRouter = core.api

  const radixGetRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(apiRouter, 'GET'),
  })
  const radixPostRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(apiRouter, 'POST'),
  })
  const radixPutRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(apiRouter, 'PUT'),
  })
  const radixPatchRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(apiRouter, 'PATCH'),
  })
  const radixDeleteRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(apiRouter, 'DELETE'),
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
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
): Record<string, { route: ApiRouteSchema; methodName: string }> {
  const filteredRoutes = Object.entries(apiRoutes).filter(([, router]) => {
    if (isApiRoute(router)) {
      return router.schema.method === method
    }
  })

  const routes = filteredRoutes.flatMap(([methodName, router]) => {
    if (isApiRoute(router)) {
      return [[router.schema.path, { route: router.schema, methodName }]] as const
    }
    const nestedRoutes = Object.entries(createRadixRoutesFromApiRouter(router, method)).map(
      ([path, route]) =>
        [path, { route: route.route, methodName: `${methodName}.${route.methodName}` }] as const
    )
    return nestedRoutes
  })

  return Object.fromEntries(routes)
}
