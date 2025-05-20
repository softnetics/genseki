import type { Simplify } from 'type-fest'

import {
  ApiRoute,
  ApiRouteHandlerPayload,
  ApiRouter,
  ApiRouteResponse,
  ApiRouteSchema,
  ServerConfig,
} from '@kivotos/core'

type ExtractObjectValues<T> = T[keyof T]

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

export type GetServerFunctionApiArgs<TApiRouter extends ApiRouter<any> | undefined> =
  ExtractObjectValues<{
    [TMethod in Extract<keyof TApiRouter, string>]: TApiRouter[TMethod] extends ApiRoute<
      any,
      infer TApiRouteSchema extends ApiRouteSchema
    >
      ? Simplify<{ method: TMethod } & ApiRouteHandlerPayload<TApiRouteSchema>>
      : never
  }>

export async function handleServerFunction<
  TServerConfig extends ServerConfig<any, any, any, any>,
  TApiArgs extends GetServerFunctionApiArgs<TServerConfig['endpoints']>,
>(
  serverConfig: TServerConfig,
  args: TApiArgs
): Promise<GetServerFunctionResponse<TServerConfig, TApiArgs['method']>> {
  const apiRoute = serverConfig.endpoints?.[args.method as keyof typeof serverConfig.endpoints]
  if (!apiRoute) {
    throw new Error(`No API route found for method: ${args.method}`)
  }
  return apiRoute.handler({ ...args, context: serverConfig.context })
}
