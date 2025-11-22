import type { ValueOf } from 'type-fest'

import {
  type ApiRoute,
  type ApiRouteHandlerPayload,
  type ApiRouteResponse,
  type ApiRouteSchema,
  type FlatApiRouter,
  type GensekiAppCompiled,
} from '../core'

export type ServerFunction<TApp extends GensekiAppCompiled = GensekiAppCompiled> = <
  TMethod extends GetGensekiApiRouterMethod<TApp['api']>,
  TArgs extends GetServerFunctionApiArgs<TApp['api'], TMethod>,
>(
  method: TMethod,
  args: TArgs
) => Promise<GetServerFunctionResponse<TApp['api'], TMethod>>

export type GetGensekiApiRouterMethod<TApiRouter extends FlatApiRouter = FlatApiRouter> = ValueOf<{
  [TKey in keyof TApiRouter]: Extract<TKey, string>
}>

export type GetServerFunctionResponse<
  TApiRouter extends FlatApiRouter,
  TMethod extends string,
> = TApiRouter[TMethod] extends ApiRoute
  ? ApiRouteResponse<TApiRouter[TMethod]['schema']['responses']>
  : ApiRouteResponse<ApiRouteSchema['responses']>

export type GetServerFunctionApiArgs<
  TApiRouter extends FlatApiRouter,
  TMethod extends string,
> = TApiRouter[TMethod] extends ApiRoute
  ? ApiRouteHandlerPayload<TApiRouter[TMethod]['schema']>
  : ApiRouteHandlerPayload<ApiRouteSchema>
