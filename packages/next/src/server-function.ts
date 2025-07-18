import { parseSetCookie } from 'cookie-es'
import { cookies } from 'next/headers'

import {
  type AnyApiRouteSchema,
  type ApiRoute,
  type ApiRouteHandlerBasePayload,
  type ApiRouter,
  type ApiRouteSchema,
  type GensekiCore,
  type GetApiRouterFromGensekiCore,
  type GetGensekiApiRouterMethod,
  type GetServerFunctionApiArgs,
  type GetServerFunctionResponse,
  isApiRoute,
} from '@genseki/react'

function findApiRoute(apiRouter: ApiRouter, methodName: string): ApiRoute | undefined {
  const [head, ...tails] = methodName.split('.')
  const router = apiRouter[head]
  if (!router) return undefined
  if (isApiRoute(router) && tails.length === 0) {
    return router
  }

  // TODO: Improve split and join logic performance
  if (!isApiRoute(router)) {
    return findApiRoute(router, tails.join('.'))
  }

  return undefined
}

function createRequest(
  schema: ApiRouteSchema,
  data: ApiRouteHandlerBasePayload<AnyApiRouteSchema>
) {
  const url = new URL(schema.path, 'http://localhost')

  for (const [key, value] of Object.entries(data.pathParams || {})) {
    url.pathname = url.pathname.replace(`:${key}`, String(value))
  }

  for (const [key, value] of Object.entries(data.query || {})) {
    url.searchParams.append(key, String(value))
  }

  const request = new Request(url, {
    method: schema.method,
    body: 'body' in data ? JSON.stringify(data.body) : undefined,
    headers: 'headers' in data ? data.headers : {},
  })

  return request
}

export async function handleServerFunction<
  TCore extends GensekiCore,
  TMethod extends GetGensekiApiRouterMethod<TCore['api']>,
  TApiArgs extends GetServerFunctionApiArgs<GetApiRouterFromGensekiCore<TCore>, TMethod>,
>(
  core: TCore,
  methodName: TMethod,
  args: TApiArgs
): Promise<GetServerFunctionResponse<GetApiRouterFromGensekiCore<TCore>, TMethod>> {
  try {
    // TODO: Recusively find the method in the core.api object
    const apiRoute = findApiRoute(core.api, methodName)
    if (!apiRoute) {
      throw new Error(`No API route found for method: ${methodName as string}`)
    }

    // TODO: Recheck if the dummy request is correct

    const response = await apiRoute.handler(
      args as any,
      createRequest(apiRoute.schema, args as any)
    )

    if (response.headers?.['Set-Cookie']) {
      const setCookieData = parseSetCookie(response.headers['Set-Cookie'])
      const c = await cookies()
      c.set(setCookieData.name, setCookieData.value, setCookieData)
    }

    return response as GetServerFunctionResponse<GetApiRouterFromGensekiCore<TCore>, TMethod>
  } catch (error) {
    console.error('Error handling server function:', error)
    return {
      status: 500,
      body: {
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    } as any
  }
}
