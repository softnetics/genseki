import type { ValueOf } from 'type-fest'

import {
  type ApiRoute,
  type ApiRouteHandlerPayload,
  type ApiRouter,
  type ApiRouteResponse,
  type ApiRouteSchema,
  type ServerConfig,
} from '@genseki/react'

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
    ? { method: TMethod } & ApiRouteHandlerPayload<TApiRouteSchema>
    : never
}>
