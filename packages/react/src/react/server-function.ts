import type { ValueOf } from 'type-fest'

import {
  type ApiRoute,
  type ApiRouteHandlerPayload,
  type ApiRouter,
  type ApiRouteResponse,
  type ApiRouteSchema,
} from '../core'
import type { GensekiCore } from '../core/config'

export type ServerFunction<TCore extends GensekiCore = GensekiCore> = <
  TMethod extends GetGensekiApiRouterMethod<TCore['api']>,
  TArgs extends GetServerFunctionApiArgs<GetApiRouterFromGensekiCore<TCore>, TMethod>,
>(
  method: TMethod,
  args: TArgs
) => Promise<GetServerFunctionResponse<GetApiRouterFromGensekiCore<TCore>, TMethod>>

export type GetApiRouterFromGensekiCore<TCore extends GensekiCore = GensekiCore> =
  TCore['api'] extends ApiRouter ? TCore['api'] : never

export type GetGensekiApiRouterMethod<TApiRouter extends ApiRouter = ApiRouter> = ValueOf<{
  [TKey in keyof TApiRouter]: TKey extends string
    ? TApiRouter[TKey] extends ApiRouter
      ? TKey extends string
        ? `${TKey}.${GetGensekiApiRouterMethod<TApiRouter[TKey]>}`
        : never
      : TKey
    : never
}>

export type GetServerFunctionResponse<
  TApiRouter extends ApiRouter,
  TMethod extends string,
> = TMethod extends `${infer TPrefix}.${infer TMethodName}`
  ? TApiRouter[TPrefix] extends ApiRouter
    ? GetServerFunctionResponse<TApiRouter[TPrefix], TMethodName>
    : TApiRouter[TMethodName] extends ApiRoute
      ? ApiRouteResponse<TApiRouter[TMethodName]['schema']['responses']>
      : ApiRouteResponse<ApiRouteSchema['responses']>
  : ApiRouteResponse<ApiRouteSchema['responses']>

export type GetServerFunctionApiArgs<
  TApiRouter extends ApiRouter,
  TMethod extends string,
> = TMethod extends `${infer TPrefix}.${infer TMethodName}`
  ? TApiRouter[TPrefix] extends ApiRouter
    ? GetServerFunctionApiArgs<TApiRouter[TPrefix], TMethodName>
    : TApiRouter[TMethodName] extends ApiRoute
      ? ApiRouteHandlerPayload<TApiRouter[TMethodName]['schema']>
      : ApiRouteHandlerPayload<ApiRouteSchema>
  : ApiRouteHandlerPayload<ApiRouteSchema>
