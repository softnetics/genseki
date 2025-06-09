import {
  type ApiRoute,
  type ApiRouteHandlerPayload,
  type ApiRouter,
  type ApiRouteResponse,
  type ApiRouteSchema,
  Context,
  createAuth,
  type ServerConfig,
} from '@genseki/react'
import { parseSetCookie, type SetCookie } from 'cookie-es'
import type { Simplify, ValueOf } from 'type-fest'

export type ServerFunction<
  TServerConfig extends ServerConfig<any, any, any, any> = ServerConfig<any, any, any, any>,
> = <TApiArgs extends GetServerFunctionApiArgs<TServerConfig['endpoints']>>(
  args: TApiArgs
) => Promise<GetServerFunctionResponse<TServerConfig, TApiArgs['method']>>

type GetServerFunctionResponse<
  TServerConfig extends ServerConfig<any, any, any, ApiRouter>,
  TMethod extends keyof TServerConfig['endpoints'],
> = TServerConfig['endpoints'][TMethod] extends infer TApiRoute extends ApiRoute<any, any>
  ? ApiRouteResponse<TApiRoute['schema']['responses']>
  : never

export type GetServerFunctionApiArgs<TApiRouter extends ApiRouter<any> | undefined> = ValueOf<{
  [TMethod in keyof TApiRouter]: TApiRouter[TMethod] extends ApiRoute<
    any,
    infer TApiRouteSchema extends ApiRouteSchema
  >
    ? Simplify<{ method: TMethod } & ApiRouteHandlerPayload<TApiRouteSchema>>
    : never
}>

export async function handleServerFunction<
  TServerConfig extends ServerConfig<any, any, any, ApiRouter<any>>,
  TApiArgs extends GetServerFunctionApiArgs<TServerConfig['endpoints']>,
>(
  serverConfig: TServerConfig,
  args: TApiArgs,
  settings?: {
    setCookies?: (cookie: SetCookie) => Promise<void> | void
  }
): Promise<GetServerFunctionResponse<TServerConfig, TApiArgs['method']>> {
  try {
    const apiRoute = serverConfig.endpoints?.[args.method as keyof typeof serverConfig.endpoints]
    if (!apiRoute) {
      throw new Error(`No API route found for method: ${args.method as string}`)
    }
    const { context: authContext } = createAuth(serverConfig.auth, serverConfig.context)
    const context = Context.toRequestContext(authContext, args.headers)

    const response = await apiRoute.handler({
      ...args,
      context,
    })

    if (response.headers?.['Set-Cookie']) {
      settings?.setCookies?.(parseSetCookie(response.headers['Set-Cookie']))
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
