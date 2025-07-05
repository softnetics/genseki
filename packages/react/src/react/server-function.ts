import type { ValueOf } from 'type-fest'

import {
  type AnyServerConfig,
  type ApiRoute,
  type ApiRouteHandlerPayload,
  type ApiRouter,
  type ApiRouteResponse,
  type ApiRouteSchema,
} from '../core'

export type ServerFunction<TServerConfig extends AnyServerConfig = AnyServerConfig> = <
  TApiArgs extends GetServerFunctionApiArgs<TServerConfig['endpoints']>,
>(
  args: TApiArgs
) => Promise<GetServerFunctionResponse<TServerConfig, TApiArgs['method']>>

export type GetServerFunctionResponse<
  TServerConfig extends AnyServerConfig,
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
