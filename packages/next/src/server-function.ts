import { parseSetCookie } from 'cookie-es'
import { cookies } from 'next/headers'

import {
  type AnyServerConfig,
  type ApiRoute,
  type GetServerFunctionApiArgs,
  type GetServerFunctionResponse,
} from '@genseki/react'

export async function handleServerFunction<
  TServerConfig extends AnyServerConfig,
  TApiArgs extends GetServerFunctionApiArgs<TServerConfig['endpoints']>,
>(
  serverConfig: TServerConfig,
  args: TApiArgs
): Promise<GetServerFunctionResponse<TServerConfig, TApiArgs['method']>> {
  try {
    const apiRoute = serverConfig.endpoints?.[
      args.method as keyof typeof serverConfig.endpoints
    ] as ApiRoute
    if (!apiRoute) {
      throw new Error(`No API route found for method: ${args.method as string}`)
    }

    const context = serverConfig.context.toRequestContext({
      headers: args.headers,
    })

    const response = await apiRoute.handler({
      ...args,
      context,
    })

    if (response.headers?.['Set-Cookie']) {
      const setCookieData = parseSetCookie(response.headers['Set-Cookie'])
      const c = await cookies()
      c.set(setCookieData.name, setCookieData.value, setCookieData)
    }

    return response as GetServerFunctionResponse<TServerConfig, TApiArgs['method']>
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
