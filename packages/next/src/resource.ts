import { type NextRequest } from 'next/server'
import { createRouter } from 'radix3'

import { ApiRoute, ApiRouter, ServerConfig } from '@kivotos/core'

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
  context: Record<string, unknown>,
  route: ApiRoute,
  pathParams: Record<string, string> | undefined
) {
  const reqHeaders = extractHeaders(req.headers)
  const reqSearchParams = extractSearchParams(req.nextUrl.searchParams)

  const rawResponse = await route.handler({
    context: context,
    headers: reqHeaders,
    pathParams: pathParams,
    query: reqSearchParams,
    body: req.body,
  })

  return new Response(JSON.stringify(rawResponse.body) as any, {
    status: rawResponse.status,
    headers: {
      'Content-Type': 'application/json',
      ...rawResponse.headers,
    },
  })
}

async function lookupRoute(
  radixRouter: ReturnType<typeof createRouter>,
  req: NextRequest,
  context: Record<string, unknown>
) {
  const match = radixRouter.lookup(req.nextUrl.pathname)
  if (!match) return Response.json({ message: 'Not Found' }, { status: 404 })
  const pathParams = match.params
  const route = match.route as ApiRoute<any>
  return makeApiRoute(req, context, route, pathParams)
}

export function createApiResourceRouter(serverConfig: ServerConfig<any, any, any, ApiRouter<any>>) {
  const radixGetRouter = createRouter({
    routes: Object.fromEntries(
      Object.entries(serverConfig.endpoints).flatMap(
        ([methodName, route]: [string, ApiRoute<typeof serverConfig.context>]) => {
          if (route.schema.method !== 'GET') return []
          console.log('GET', route.schema.path)
          return [[route.schema.path, { route, methodName }]]
        }
      )
    ),
  })

  const radixPostRouter = createRouter({
    routes: Object.fromEntries(
      Object.entries(serverConfig.endpoints).flatMap(
        ([methodName, route]: [string, ApiRoute<typeof serverConfig.context>]) => {
          if (route.schema.method !== 'POST') return []

          return [[route.schema.path, { route, methodName }]]
        }
      )
    ),
  })

  const radixPutRouter = createRouter({
    routes: Object.fromEntries(
      Object.entries(serverConfig.endpoints).flatMap(
        ([methodName, route]: [string, ApiRoute<typeof serverConfig.context>]) => {
          if (route.schema.method !== 'PUT') return []
          console.log('PUT', route.schema.path)
          return [[route.schema.path, { route, methodName }]]
        }
      )
    ),
  })

  const radixPatchRouter = createRouter({
    routes: Object.fromEntries(
      Object.entries(serverConfig.endpoints).flatMap(
        ([methodName, route]: [string, ApiRoute<typeof serverConfig.context>]) => {
          if (route.schema.method !== 'PATCH') return []
          console.log('PATCH', route.schema.path)
          return [[route.schema.path, { route, methodName }]]
        }
      )
    ),
  })

  const radixDeleteRouter = createRouter({
    routes: Object.fromEntries(
      Object.entries(serverConfig.endpoints).flatMap(
        ([methodName, route]: [string, ApiRoute<typeof serverConfig.context>]) => {
          if (route.schema.method !== 'DELETE') return []
          console.log('DELETE', route.schema.path)
          return [[route.schema.path, { route, methodName }]]
        }
      )
    ),
  })

  return {
    GET: async (req: NextRequest) => {
      return lookupRoute(radixGetRouter, req, serverConfig.context)
    },
    POST: async (req: NextRequest) => {
      return lookupRoute(radixPostRouter, req, serverConfig.context)
    },
    PUT: async (req: NextRequest) => {
      return lookupRoute(radixPutRouter, req, serverConfig.context)
    },
    DELETE: async (req: NextRequest) => {
      return lookupRoute(radixDeleteRouter, req, serverConfig.context)
    },
    PATCH: async (req: NextRequest) => {
      return lookupRoute(radixPatchRouter, req, serverConfig.context)
    },
  }
}
