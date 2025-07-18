import { type NextRequest } from 'next/server'
import { createRouter } from 'radix3'

import {
  type ApiRoute,
  type ApiRouter,
  Context,
  createAuth,
  type ServerConfig,
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
  serverConfig: ServerConfig<any, any, any, ApiRouter<any>>,
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

  const { authContext } = createAuth(serverConfig.auth, serverConfig.context)
  const context = Context.toRequestContext(serverConfig.context, {
    authContext,
    headers: reqHeaders,
  })

  try {
    const rawResponse = await route.handler({
      context,
      headers: reqHeaders,
      pathParams: pathParams,
      query: reqSearchParams,
      body,
    })

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

async function lookupRoute(
  radixRouter: ReturnType<typeof createRouter>,
  req: NextRequest,
  serverConfig: ServerConfig<any, any, any, ApiRouter<any>>
) {
  const match = radixRouter.lookup(req.nextUrl.pathname)
  if (!match) return Response.json({ message: 'Not Found' }, { status: 404 })
  const pathParams = match.params
  const route = match.route as ApiRoute<any>
  return makeApiRoute(req, serverConfig, route, pathParams)
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
          console.log('POST', route.schema.path)
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
      return lookupRoute(radixGetRouter, req, serverConfig)
    },
    POST: async (req: NextRequest) => {
      return lookupRoute(radixPostRouter, req, serverConfig)
    },
    PUT: async (req: NextRequest) => {
      return lookupRoute(radixPutRouter, req, serverConfig)
    },
    DELETE: async (req: NextRequest) => {
      return lookupRoute(radixDeleteRouter, req, serverConfig)
    },
    PATCH: async (req: NextRequest) => {
      return lookupRoute(radixPatchRouter, req, serverConfig)
    },
  }
}
