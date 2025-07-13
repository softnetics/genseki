import type { IsNever, Simplify, ValueOf } from 'type-fest'
import type { z } from 'zod/v4'
import { type ZodType } from 'zod/v4'
import type { JSONSchema } from 'zod/v4/core'

import type { MaybePromise } from './collection'
import type { AnyContextable, ContextToRequestContext } from './context'
import type { ConditionalExceptNever } from './utils'

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

type ApiRouteHandlerBasePayload<TApiRouteSchema extends ApiRouteSchema> = {
  body: GetBody<TApiRouteSchema>
  query: GetQuery<TApiRouteSchema>
  pathParams: GetPathParams<TApiRouteSchema>
} & GetHeadersObject<TApiRouteSchema>

export type ApiRouteHandlerPayload<TApiRouteSchema extends ApiRouteSchema> = ConditionalExceptNever<
  ApiRouteHandlerBasePayload<TApiRouteSchema>
>

export type ApiRouteHandlerPayloadWithContext<
  TContext extends AnyContextable,
  TApiRouteSchema extends ApiRouteSchema,
> = ApiRouteHandlerPayload<TApiRouteSchema> & {
  context: ContextToRequestContext<TContext>
}

export type ApiRouteResponse<TResponses extends Partial<Record<ApiHttpStatus, InputSchema>>> =
  ValueOf<{
    [TStatus in Extract<keyof TResponses, number>]: TResponses[TStatus] extends InputSchema
      ? {
          status: TStatus
          body: Output<TResponses[TStatus]>
          headers?: Record<string, string>
        }
      : never
  }>

export type ApiRouteHandler<
  TContext extends AnyContextable,
  TApiRouteSchema extends ApiRouteSchema = ApiRouteSchema,
> = (
  payload: ApiRouteHandlerPayloadWithContext<TContext, TApiRouteSchema>,
  request: Request
) => MaybePromise<ApiRouteResponse<TApiRouteSchema['responses']>>

export type GetApiRouteSchemaFromApiRouteHandler<TApiRouteHandler extends ApiRouteHandler<any>> =
  TApiRouteHandler extends ApiRouteHandler<any, infer TApiRouteSchema extends ApiRouteSchema>
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

export type ApiRoute<TApiRouteSchema extends ApiRouteSchema = ApiRouteSchema> = {
  schema: TApiRouteSchema
  handler: ApiRouteHandler<AnyContextable, TApiRouteSchema>
}

export type ApiRouteWithContext<
  TContext extends AnyContextable = AnyContextable,
  TApiRouteSchema extends ApiRouteSchema = ApiRouteSchema,
> = {
  schema: TApiRouteSchema
  handler: ApiRouteHandler<TContext, TApiRouteSchema>
}

export interface ApiRouter {
  [key: string]: ApiRouter | ApiRoute
}

export interface AnyApiRouter {
  [key: string]: ApiRouter | ApiRoute<AnyApiRouteSchema>
}

export function createEndpoint<const TApiEndpointSchema extends ApiRouteSchema>(
  schema: TApiEndpointSchema,
  handler: ApiRouteHandler<AnyContextable, TApiEndpointSchema>
) {
  return {
    schema,
    handler: handler,
    // handler: withValidator(schema, handler),
  }
}
