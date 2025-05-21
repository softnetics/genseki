import type { Simplify, ValueOf } from 'type-fest'

import type {
  ApiRoute,
  ApiRouteHandlerPayload,
  ApiRouter,
  ApiRouteResponse,
  ApiRouteSchema,
  ServerConfig,
} from '@kivotos/core'

export type ServerFunction<TServerConfig extends ServerConfig<any, any, any, any>> = <
  TApiArgs extends GetServerFunctionApiArgs<TServerConfig['endpoints']>,
>(
  args: TApiArgs
) => Promise<GetServerFunctionResponse<TServerConfig, TApiArgs['method']>>

type GetServerFunctionResponse<
  TServerConfig extends ServerConfig<any, any, any, ApiRouter>,
  TMethod extends keyof TServerConfig['endpoints'],
> = TServerConfig['endpoints'][TMethod] extends infer TApiRoute extends ApiRoute<any, any>
  ? ApiRouteResponse<TApiRoute['schema']['responses']>
  : never

export type GetServerFunctionApiArgs<TApiRouter extends ApiRouter<any> | undefined> = ValueOf<{
  [TMethod in Extract<keyof TApiRouter, string>]: TApiRouter[TMethod] extends ApiRoute<
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
  args: TApiArgs
): Promise<GetServerFunctionResponse<TServerConfig, TApiArgs['method']>> {
  const apiRoute = serverConfig.endpoints?.[args.method as keyof typeof serverConfig.endpoints]
  if (!apiRoute) {
    throw new Error(`No API route found for method: ${args.method}`)
  }
  return apiRoute.handler({ ...args, context: serverConfig.context }) as GetServerFunctionResponse<
    TServerConfig,
    TApiArgs['method']
  >
}
