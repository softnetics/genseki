import type { IsNever, Simplify, ValueOf } from 'type-fest'
import type { z } from 'zod/v4'
import { type ZodType } from 'zod/v4'
import type { JSONSchema } from 'zod/v4/core'

import type { MaybePromise } from './collection'
import type { AnyContextable, AnyRequestContextable, ContextToRequestContext } from './context'
import { withValidator } from './endpoint.utils'
import { type ConditionalExceptNever } from './utils'

export type ApiHttpStatus = 200 | 201 | 204 | 301 | 302 | 400 | 401 | 403 | 404 | 409 | 422 | 500

export type InputSchema = ZodType<unknown, unknown> | undefined
export type Output<T extends InputSchema> =
  T extends ZodType<unknown, unknown> ? z.output<T> : never

export type InferPathParams<TPath extends string> = Simplify<
  TPath extends `${string}/:${infer TRest}`
    ? {
        [key in TRest as TRest extends `${infer THead}/${string}` ? THead : TRest]: string
      } & (IsNever<InferPathParams<TRest>> extends true ? {} : InferPathParams<TRest>)
    : never
>

export type FlattenApiRouter<TApiRouter extends AnyApiRouter> = ValueOf<{
  [TKey in keyof TApiRouter]: TApiRouter[TKey] extends infer TApiRoute extends ApiRoute
    ? Simplify<TApiRoute>
    : TApiRouter[TKey] extends infer TApiRouter extends AnyApiRouter
      ? Simplify<FlattenApiRouter<TApiRouter>>
      : never
}>

export type FilterByMethod<TApiRoute extends ApiRoute, TMethod extends string> = Extract<
  TApiRoute,
  { schema: { method: TMethod } }
>

// TODO: With IsNever, the performance is not good. Need to fix it.
type GetBody<TApiRouteSchema extends ApiRouteSchema> =
  IsNever<TApiRouteSchema['body']> extends false ? Output<TApiRouteSchema['body']> : never

type GetHeadersObject<TApiRouteSchema extends ApiRouteSchema> =
  IsNever<Output<TApiRouteSchema['headers']>> extends false
    ? { headers: Output<TApiRouteSchema['headers']> & Record<string, string> }
    : { headers?: Record<string, string> }

type GetQuery<TApiRouteSchema extends ApiRouteSchema> =
  IsNever<Output<TApiRouteSchema['query']>> extends false ? Output<TApiRouteSchema['query']> : never

type GetPathParams<TApiRouteSchema extends ApiRouteSchema> =
  IsNever<Output<TApiRouteSchema['pathParams']>> extends false
    ? Output<TApiRouteSchema['pathParams']>
    : IsNever<InferPathParams<TApiRouteSchema['path']>> extends false
      ? InferPathParams<TApiRouteSchema['path']>
      : never

export type ApiRouteHandlerBasePayload<TApiRouteSchema extends ApiRouteSchema> = {
  body: GetBody<TApiRouteSchema>
  query: GetQuery<TApiRouteSchema>
  pathParams: GetPathParams<TApiRouteSchema>
} & GetHeadersObject<TApiRouteSchema>

export type ApiRouteHandlerPayload<TApiRouteSchema extends ApiRouteSchema> = ConditionalExceptNever<
  ApiRouteHandlerBasePayload<TApiRouteSchema>
>

export type ApiRouteResponse<TResponses extends Partial<Record<ApiHttpStatus, InputSchema>>> =
  ValueOf<{
    [TStatus in Extract<keyof TResponses, number>]: TResponses[TStatus] extends InputSchema
      ? {
          status: TStatus
          body: Output<TResponses[TStatus]>
        }
      : never
  }>

export type ApiRouteHandler<TApiRouteSchema extends ApiRouteSchema = ApiRouteSchema> = (
  payload: ApiRouteHandlerPayload<TApiRouteSchema>,
  meta: { request: Request; response: Response }
) => MaybePromise<ApiRouteResponse<TApiRouteSchema['responses']>>

export type ApiRouteHandlerInitial<
  TContext extends AnyRequestContextable,
  TApiRouteSchema extends ApiRouteSchema,
> = (
  payload: ApiRouteHandlerPayload<TApiRouteSchema> & { context: TContext },
  meta: { request: Request; response: Response }
) => MaybePromise<ApiRouteResponse<TApiRouteSchema['responses']>>

export type GetApiRouteSchemaFromApiRouteHandler<TApiRouteHandler extends ApiRouteHandler<any>> =
  TApiRouteHandler extends ApiRouteHandler<infer TApiRouteSchema extends ApiRouteSchema>
    ? TApiRouteSchema
    : never

export type InferApiRouteResponses<TApiRouteSchema extends ApiRouteSchema> = ValueOf<{
  [TStatus in keyof TApiRouteSchema['responses']]: TApiRouteSchema['responses'][TStatus] extends InputSchema
    ? { status: TStatus; data: Output<TApiRouteSchema['responses'][TStatus]> }
    : never
}>

export interface ApiRouteSchema {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  body?: InputSchema
  query?: InputSchema
  headers?: InputSchema
  pathParams?: InputSchema
  description?: string
  responses: Partial<Record<ApiHttpStatus, InputSchema>>
}

export interface ApiRouteSchemaClient {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  body?: JSONSchema.JSONSchema
  query?: JSONSchema.JSONSchema
  headers?: JSONSchema.JSONSchema
  pathParams?: JSONSchema.JSONSchema
  description?: string
  responses: Partial<Record<ApiHttpStatus, JSONSchema.JSONSchema>>
}

export interface AnyApiRouteSchema {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  body?: any
  pathParams?: any
  query?: any
  headers?: any
  description?: string
  responses: Partial<Record<ApiHttpStatus, any>>
}

export type ApiRoute<TApiRouteSchema extends AnyApiRouteSchema = AnyApiRouteSchema> = {
  schema: TApiRouteSchema
  handler: ApiRouteHandler<TApiRouteSchema>
}

export interface ApiRouter {
  [key: string]: ApiRouter | ApiRoute
}

export interface AnyApiRouter {
  [key: string]: AnyApiRouter | ApiRoute<AnyApiRouteSchema>
}

export function isApiRoute<TApiRoute extends ApiRoute>(
  apiRoute: TApiRoute | ApiRouter
): apiRoute is TApiRoute {
  return 'schema' in apiRoute && 'handler' in apiRoute
}

export function createEndpoint<
  const TContext extends AnyContextable,
  const TApiRouteSchema extends ApiRouteSchema,
>(
  context: TContext,
  schema: TApiRouteSchema,
  handler: ApiRouteHandlerInitial<ContextToRequestContext<TContext>, TApiRouteSchema>
): ApiRoute<TApiRouteSchema> {
  return {
    schema: schema,
    handler: withValidator(schema, async (payload, { request, response }) => {
      const requestContext = context.toRequestContext(request) as ContextToRequestContext<TContext>
      const responseBody = await handler(
        { ...payload, context: requestContext },
        { request, response }
      )
      return responseBody
    }),
  }
}

export type AppendApiPathPrefix<TPathPrefix extends string, TApiRouter extends ApiRouter> = {
  [TKey in keyof TApiRouter]: TApiRouter[TKey] extends ApiRoute
    ? {
        schema: Omit<TApiRouter[TKey]['schema'], 'path'> & {
          path: `${TPathPrefix}${TApiRouter[TKey]['schema']['path']}`
        }
        handler: TApiRouter[TKey]['handler']
      }
    : TApiRouter[TKey] extends ApiRouter
      ? AppendApiPathPrefix<TPathPrefix, TApiRouter[TKey]>
      : never
}

export function appendApiPathPrefix<TPathPrefix extends string, TApiRouter extends ApiRouter>(
  prefix: TPathPrefix,
  apiRouter: TApiRouter
): AppendApiPathPrefix<TPathPrefix, TApiRouter> {
  const transformedApiRouter: AppendApiPathPrefix<TPathPrefix, TApiRouter> = {} as any
  for (const key in apiRouter) {
    const route = apiRouter[key]
    if (isApiRoute(route)) {
      Object.assign(transformedApiRouter, {
        [key]: {
          schema: { ...route.schema, path: `${prefix}${route.schema.path}` },
          handler: route.handler,
        },
      })
      continue
    }
    Object.assign(transformedApiRouter, { [key]: appendApiPathPrefix(prefix, route) })
  }
  return transformedApiRouter
}
