import { ExtractObjectValues, Simplify } from 'drizzle-orm'
import { IsNever, SimplifyDeep } from 'type-fest'
import { z, ZodType } from 'zod'

import { MaybePromise } from './collection'

export type ApiHttpStatus = 200 | 201 | 204 | 301 | 302 | 400 | 401 | 403 | 404 | 409 | 422 | 500

export type InputSchema = ZodType<unknown, any, unknown> | undefined
export type Output<T extends InputSchema> =
  T extends ZodType<unknown, any, unknown> ? z.output<T> : never

export type InferPathParams<TPath extends string> = Simplify<
  TPath extends `${string}/:${infer TRest}`
    ? {
        [key in TRest as TRest extends `${infer THead}/${string}` ? THead : TRest]: string
      } & (IsNever<InferPathParams<TRest>> extends true ? {} : InferPathParams<TRest>)
    : never
>

// TODO: With IsNever, the performance is not good. Need to fix it.
type GetBody<TApiRouteSchema extends ApiRouteSchema> =
  TApiRouteSchema extends ApiRouteMutationSchema
    ? IsNever<TApiRouteSchema['body']> extends false
      ? { body: Output<TApiRouteSchema['body']> }
      : {}
    : {}

type GetHeaders<TApiRouteSchema extends ApiRouteSchema> = {
  headers: IsNever<Output<TApiRouteSchema['headers']>> extends false
    ? Output<TApiRouteSchema['headers']> & Record<string, string>
    : Record<string, string>
}

type GetQuery<TApiRouteSchema extends ApiRouteSchema> =
  IsNever<Output<TApiRouteSchema['query']>> extends false
    ? { query: Output<TApiRouteSchema['query']> }
    : {}

type GetPathParams<TApiRouteSchema extends ApiRouteSchema> =
  IsNever<Output<TApiRouteSchema['pathParams']>> extends false
    ? { pathParams: Output<TApiRouteSchema['pathParams']> }
    : IsNever<InferPathParams<TApiRouteSchema['path']>> extends false
      ? { pathParams: InferPathParams<TApiRouteSchema['path']> }
      : {}

export type ApiRouteHandlerPayload<TApiRouteSchema extends ApiRouteSchema> = SimplifyDeep<
  GetBody<TApiRouteSchema> &
    GetHeaders<TApiRouteSchema> &
    GetQuery<TApiRouteSchema> &
    GetPathParams<TApiRouteSchema>
>

export type ApiRouteHandlerPayloadWithContext<
  TApiRouteSchema extends ApiRouteSchema,
  TContext extends Record<string, unknown> = Record<string, unknown>,
> = ApiRouteHandlerPayload<TApiRouteSchema> & {
  context: TContext
}

export type ApiRouteResponse<TResponses extends Partial<Record<ApiHttpStatus, InputSchema>>> =
  ExtractObjectValues<{
    [TStatus in keyof TResponses]: TResponses[TStatus] extends InputSchema
      ? {
          status: TStatus
          body: Output<TResponses[TStatus]>
          headers?: Record<string, string>
        }
      : never
  }>

export type ApiRouteHandler<
  TContext extends Record<string, unknown> = Record<string, unknown>,
  TApiRouteSchema extends ApiRouteSchema = ApiRouteSchema,
> = (
  payload: ApiRouteHandlerPayloadWithContext<TApiRouteSchema, TContext>
) => MaybePromise<ApiRouteResponse<TApiRouteSchema['responses']>>

export type GetApiRouteSchemaFromApiRouteHandler<
  TApiRouteHandler extends ApiRouteHandler<any, any>,
> =
  TApiRouteHandler extends ApiRouteHandler<any, infer TApiRouteSchema extends ApiRouteSchema>
    ? TApiRouteSchema
    : never

export interface ApiRouteCommonSchema {
  path: string
  pathParams?: InputSchema
  query?: InputSchema
  headers?: InputSchema
  description?: string
  responses: Partial<Record<ApiHttpStatus, InputSchema>>
}

export type InferApiRouteResponses<TApiRouteSchema extends ApiRouteSchema> = ExtractObjectValues<{
  [TStatus in keyof TApiRouteSchema['responses']]: TApiRouteSchema['responses'][TStatus] extends InputSchema
    ? { status: TStatus; data: Output<TApiRouteSchema['responses'][TStatus]> }
    : never
}>

export interface ApiRouteQuerySchema extends ApiRouteCommonSchema {
  method: 'GET'
}

export interface ApiRouteMutationSchema extends ApiRouteCommonSchema {
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body: InputSchema
}

export type ApiRouteSchema = ApiRouteQuerySchema | ApiRouteMutationSchema

export type ApiRoute<
  TContext extends Record<string, unknown> = Record<string, unknown>,
  TApiRouteSchema extends ApiRouteSchema = any,
> = {
  schema: TApiRouteSchema
  handler: ApiRouteHandler<TContext, TApiRouteSchema>
}

export interface ApiRouter<TContext extends Record<string, unknown> = Record<string, unknown>> {
  [key: string]: ApiRoute<TContext>
}

export interface ClientApiRouter {
  [key: string]: ApiRouteSchema
}

export type ToClientApiRouter<TApiRouter extends ApiRouter> = {
  [TKey in keyof TApiRouter]: Omit<TApiRouter[TKey], 'handler'> extends infer TApiRoute extends
    ApiRouteSchema
    ? TApiRoute
    : never
}

export function createEndpoint<
  TApiEndpointSchema extends ApiRouteSchema,
  TContext extends Record<string, unknown> = Record<string, unknown>,
>(schema: TApiEndpointSchema, handler: ApiRouteHandler<TContext, TApiEndpointSchema>) {
  return {
    schema,
    handler,
  }
}
