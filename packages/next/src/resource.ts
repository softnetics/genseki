import { type NextRequest } from 'next/server'
import { createRouter } from 'radix3'

import { type ApiRoute, type ApiRouter, type GensekiCore, isApiRoute } from '@genseki/react'

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

export function createApiResourceRouter(core: GensekiCore, prefix: string = '/api') {
  const apiRouter = core.api

  const radixGetRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(prefix, apiRouter, 'GET'),
  })
  const radixPostRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(prefix, apiRouter, 'POST'),
  })
  const radixPutRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(prefix, apiRouter, 'PUT'),
  })
  const radixPatchRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(prefix, apiRouter, 'PATCH'),
  })
  const radixDeleteRouter = createRouter({
    routes: createRadixRoutesFromApiRouter(prefix, apiRouter, 'DELETE'),
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
  prefix: string,
  apiRoutes: ApiRouter,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
): Record<string, { route: ApiRoute; methodName: string }> {
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
    const nestedRoutes = Object.entries(createRadixRoutesFromApiRouter(prefix, router, method)).map(
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
