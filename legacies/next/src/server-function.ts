import { parseSetCookie } from 'cookie-es'
import { cookies } from 'next/headers'

import {
  type AnyApiRouteSchema,
  type ApiRoute,
  type ApiRouteHandlerBasePayload,
  type ApiRouteSchema,
  type GensekiCore,
  type GetGensekiApiRouterMethod,
  type GetServerFunctionApiArgs,
  type GetServerFunctionResponse,
} from '@genseki/react'

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

function createResponse() {
  const response = new Response(null)
  response.headers.set('Content-Type', 'application/json')
  return response
}

export async function handleServerFunction<
  TCore extends GensekiCore,
  TMethod extends GetGensekiApiRouterMethod<TCore['api']>,
  TApiArgs extends GetServerFunctionApiArgs<TCore['api'], TMethod>,
>(
  core: TCore,
  methodName: TMethod,
  args: TApiArgs
): Promise<GetServerFunctionResponse<TCore['api'], TMethod>> {
  try {
    const apiRoute = core.api[methodName as keyof typeof core.api] as ApiRoute | undefined
    if (!apiRoute) {
      throw new Error(`No API route found for method: ${methodName as string}`)
    }

    const request = createRequest(apiRoute.schema, args as any)
    const response = createResponse()
    const result = await apiRoute.handler(args as any, { request: request, response: response })

    if (response.headers.getSetCookie().length) {
      // TODO: Recheck getSetCookie method and response
      const setCookieData = parseSetCookie(response.headers.getSetCookie()[0])
      const c = await cookies()
      c.set(setCookieData.name, setCookieData.value, setCookieData)
    }

    return result as GetServerFunctionResponse<TCore['api'], TMethod>
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
