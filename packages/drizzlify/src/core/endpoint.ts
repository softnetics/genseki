import { ExtractObjectValues, Simplify } from 'drizzle-orm'
import type { ConditionalExcept } from 'type-fest'
import { z, ZodType } from 'zod'

import { MaybePromise } from './collection'

export type ApiHttpStatus = 200 | 201 | 204 | 301 | 302 | 400 | 401 | 403 | 404 | 409 | 422 | 500

export type InputSchema = ZodType<unknown, unknown> | undefined
export type Output<T extends InputSchema> =
  T extends ZodType<unknown, unknown> ? z.output<T> : never

export type InferPathParams<TPath extends string> = Simplify<
  TPath extends `${string}/:${infer TRest}`
    ? {
        [key in TRest as TRest extends `${infer THead}/${string}` ? THead : TRest]: string
      } & InferPathParams<TRest>
    : never
>

export type ApiRouteHandlerPayload<
  TContext extends Record<string, unknown> = {},
  TApiRouteSchema extends ApiRouteSchema = ApiRouteSchema,
> = {
  body: TApiRouteSchema extends ApiRouteMutationSchema ? Output<TApiRouteSchema['body']> : never
  headers: Output<TApiRouteSchema['headers']>
  query: Output<TApiRouteSchema['query']>
  pathParams: TApiRouteSchema['pathParams'] extends InputSchema
    ? InferPathParams<TApiRouteSchema['path']> & Output<TApiRouteSchema['pathParams']>
    : InferPathParams<TApiRouteSchema['path']>
  context: TContext
}

export type ClientApiRouteHandlerPayload<TApiRouteSchema extends ApiRouteSchema = ApiRouteSchema> =
  ConditionalExcept<
    {
      body: TApiRouteSchema extends ApiRouteMutationSchema ? Output<TApiRouteSchema['body']> : never
      headers: Output<TApiRouteSchema['headers']>
      query: Output<TApiRouteSchema['query']>
      pathParams: TApiRouteSchema['pathParams'] extends InputSchema
        ? InferPathParams<TApiRouteSchema['path']> & Output<TApiRouteSchema['pathParams']>
        : InferPathParams<TApiRouteSchema['path']>
    },
    never
  >

export type ApiRouteResponse<TResponses extends Partial<Record<ApiHttpStatus, InputSchema>>> =
  ExtractObjectValues<{
    [TStatus in keyof TResponses]: TResponses[TStatus] extends InputSchema
      ? {
          status: TStatus
          body: Output<TResponses[TStatus]>
          headers?: Headers
        }
      : never
  }>

export type ApiRouteHandler<
  TContext extends Record<string, unknown> = {},
  TApiRouteSchema extends ApiRouteSchema = ApiRouteSchema,
> = (
  payload: ApiRouteHandlerPayload<TContext, TApiRouteSchema>
) => MaybePromise<ApiRouteResponse<TApiRouteSchema['responses']>>

export type GetApiRouteSchemaFromApiRouteHandler<
  TApiRouteHandler extends ApiRouteHandler<any, any>,
> =
  TApiRouteHandler extends ApiRouteHandler<any, infer TApiRouteSchema extends ApiRouteSchema>
    ? TApiRouteSchema
    : never

export type ApiRouteMiddleware<
  TContext extends Record<string, unknown> = {},
  TApiRouteSchema extends ApiRouteSchema = ApiRouteSchema,
> = (args: {
  payload: ApiRouteHandlerPayload<TContext, TApiRouteSchema>
  req: Request
  next: (args: {
    payload: ApiRouteHandlerPayload<TContext, TApiRouteSchema>
    req: Request
  }) => MaybePromise<Response>
}) => MaybePromise<Response>

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
> = Simplify<
  TApiRouteSchema & {
    handler: ApiRouteHandler<TContext, TApiRouteSchema>
  }
>

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
    ...schema,
    handler,
  }
}
