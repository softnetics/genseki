import type { ConditionalExcept, IsNever, Simplify, ValueOf } from 'type-fest'
import { z, type ZodType } from 'zod/v4'

import type { MaybePromise } from './collection'
import type { Context, ContextToRequestContext } from './context'

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
  TApiRouteSchema extends ApiRouteMutationSchema
    ? IsNever<TApiRouteSchema['body']> extends false
      ? Output<TApiRouteSchema['body']>
      : never
    : never

type GetHeaders<TApiRouteSchema extends ApiRouteSchema> =
  IsNever<Output<TApiRouteSchema['headers']>> extends false
    ? Output<TApiRouteSchema['headers']> & Record<string, string>
    : Record<string, string> | undefined

type GetQuery<TApiRouteSchema extends ApiRouteSchema> =
  IsNever<Output<TApiRouteSchema['query']>> extends false ? Output<TApiRouteSchema['query']> : never

type GetPathParams<TApiRouteSchema extends ApiRouteSchema> =
  IsNever<Output<TApiRouteSchema['pathParams']>> extends false
    ? Output<TApiRouteSchema['pathParams']>
    : IsNever<InferPathParams<TApiRouteSchema['path']>> extends false
      ? InferPathParams<TApiRouteSchema['path']>
      : never

export type ApiRouteHandlerPayload<TApiRouteSchema extends ApiRouteSchema> = ConditionalExcept<
  {
    body: GetBody<TApiRouteSchema>
    headers: GetHeaders<TApiRouteSchema>
    query: GetQuery<TApiRouteSchema>
    pathParams: GetPathParams<TApiRouteSchema>
  },
  never
>

export type ApiRouteHandlerPayloadWithContext<
  TApiRouteSchema extends ApiRouteSchema,
  TContext extends Context = Context,
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
  TContext extends Context = Context,
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

export type InferApiRouteResponses<TApiRouteSchema extends ApiRouteSchema> = ValueOf<{
  [TStatus in keyof TApiRouteSchema['responses']]: TApiRouteSchema['responses'][TStatus] extends InputSchema
    ? { status: TStatus; data: Output<TApiRouteSchema['responses'][TStatus]> }
    : never
}>

export interface ApiRouteCommonSchema {
  path: string
  pathParams?: InputSchema
  query?: InputSchema
  headers?: InputSchema
  description?: string
  responses: Partial<Record<ApiHttpStatus, InputSchema>>
}

export interface ApiRouteQuerySchema extends ApiRouteCommonSchema {
  method: 'GET'
}

export interface ApiRouteMutationSchema extends ApiRouteCommonSchema {
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body: InputSchema
}

export type ApiRouteSchema = ApiRouteQuerySchema | ApiRouteMutationSchema

export type ApiRoute<
  TContext extends Context = Context,
  TApiRouteSchema extends ApiRouteSchema = ApiRouteSchema,
> = {
  schema: TApiRouteSchema
  handler: ApiRouteHandler<TContext, TApiRouteSchema>
}

export type AppendPrefixPathToApiRoute<
  TApiRoute extends ApiRoute<any, any>,
  TPrefixPath extends string,
> =
  TApiRoute extends ApiRoute<infer TContext, any>
    ? TApiRoute extends { schema: { path: infer TPath extends string } }
      ? Simplify<
          { path: `${TPrefixPath}${TPath}` } & Omit<TApiRoute['schema'], 'path'>
        > extends infer TNewApiRouteSchema extends ApiRouteSchema
        ? ApiRoute<TContext, TNewApiRouteSchema>
        : never
      : never
    : never

export interface ApiRouter<TContext extends Context = Context> {
  [key: string]: ApiRoute<TContext, any>
}

export interface ClientApiRouteSchema {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  pathParams?: z.core.JSONSchema.BaseSchema
  query?: z.core.JSONSchema.BaseSchema
  headers?: z.core.JSONSchema.BaseSchema
  description?: string
  body?: z.core.JSONSchema.BaseSchema
  responses: Partial<Record<ApiHttpStatus, z.core.JSONSchema.BaseSchema>>
}

export interface ClientApiRouter {
  [key: string]: ClientApiRouteSchema
}

export type ToRecordApiRouteSchema<TApiRouter extends ApiRouter<any>> = {
  [TKey in keyof TApiRouter]: TApiRouter[TKey] extends ApiRoute<any, any>
    ? TApiRouter[TKey]['schema']
    : never
}

export type ToClientApiRouteSchema<TApiRouter extends ApiRouter<any>> = {
  [TKey in keyof TApiRouter]: ClientApiRouteSchema
}

export function createEndpoint<
  TContext extends Context = Context,
  TApiRouteSchema extends ApiRouteSchema = ApiRouteSchema,
>(
  schema: TApiRouteSchema,
  handler: ApiRouteHandler<TContext, TApiRouteSchema>
): ApiRoute<TContext, TApiRouteSchema> {
  return {
    schema,
    handler: handler,
    // handler: withValidator(schema, handler),
  }
}

export function getClientEndpoint(endpoint: ApiRoute<any>): ClientApiRouteSchema {
  const schema = endpoint.schema
  const template = {
    path: schema.path,
    method: schema.method,
    ...(schema.headers ? { headers: z.toJSONSchema(schema.headers) } : {}),
    ...(schema.pathParams
      ? {
          pathParams: z.toJSONSchema(schema.pathParams),
        }
      : {}),
    ...(schema.query ? { query: z.toJSONSchema(schema.query) } : {}),
    responses: Object.fromEntries(
      Object.entries(schema.responses).map(([key, value]) => {
        return [key, value ? z.toJSONSchema(value) : undefined]
      })
    ) as Partial<Record<ApiHttpStatus, z.core.JSONSchema.BaseSchema>>,
  }

  if (schema.method === 'GET') {
    return template as ClientApiRouteSchema
  }

  return {
    ...template,
    body: schema.body ? z.toJSONSchema(schema.body) : undefined,
  } as ClientApiRouteSchema
}
