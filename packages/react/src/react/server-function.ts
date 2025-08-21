import type { ValueOf } from 'type-fest'

import {
  type AnyApiRouter,
  type ApiRoute,
  type ApiRouteHandlerPayload,
  type ApiRouter,
  type ApiRouteResponse,
  type ApiRouteSchema,
  type GensekiAppCompiled,
} from '../core'

export type ServerFunction<TApp extends GensekiAppCompiled = GensekiAppCompiled> = <
  TMethod extends GetGensekiApiRouterMethod<TApp['api']>,
  TArgs extends GetServerFunctionApiArgs<GetApiRouterFromGensekiCore<TApp['api']>, TMethod>,
>(
  method: TMethod,
  args: TArgs
) => Promise<GetServerFunctionResponse<GetApiRouterFromGensekiCore<TApp['api']>, TMethod>>

export type GetApiRouterFromGensekiCore<TApiRouter extends AnyApiRouter> =
  TApiRouter extends ApiRouter ? TApiRouter : never

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
