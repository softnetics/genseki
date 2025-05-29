import type { JSONSchema7 } from 'json-schema'
import type { IsNever, Simplify, SimplifyDeep, ValueOf } from 'type-fest'
import type { z, ZodType } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import type { MaybePromise } from './collection'
import { withValidator } from './utils'

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

type GetHeaders<TApiRouteSchema extends ApiRouteSchema> =
  IsNever<Output<TApiRouteSchema['headers']>> extends false
    ? { headers: Output<TApiRouteSchema['headers']> & Record<string, string> }
    : { headers?: Record<string, string> }

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
  TContext extends Record<string, unknown> = Record<string, unknown>,
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

export interface ApiRouter<TContext extends Record<string, unknown> = Record<string, unknown>> {
  [key: string]: ApiRoute<TContext, any>
}

export interface ClientApiRouteSchema {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  pathParams?: JSONSchema7
  query?: JSONSchema7
  headers?: JSONSchema7
  description?: string
  body?: JSONSchema7
  responses: Partial<Record<ApiHttpStatus, JSONSchema7>>
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
  const TApiEndpointSchema extends ApiRouteSchema,
  const TContext extends Record<string, unknown> = Record<string, unknown>,
>(schema: TApiEndpointSchema, handler: ApiRouteHandler<TContext, TApiEndpointSchema>) {
  return {
    schema,
    handler: withValidator(schema, handler),
  }
}

export function getClientEndpoint(endpoint: ApiRoute<any>): ClientApiRouteSchema {
  const schema = endpoint.schema
  const template = {
    path: schema.path,
    method: schema.method,
    ...(schema.headers
      ? { headers: zodToJsonSchema(schema.headers, { errorMessages: true }) as JSONSchema7 }
      : {}),
    ...(schema.pathParams
      ? {
          pathParams: zodToJsonSchema(schema.pathParams, {
            errorMessages: true,
          }) as JSONSchema7,
        }
      : {}),
    ...(schema.query ? { query: zodToJsonSchema(schema.query) as JSONSchema7 } : {}),
    responses: Object.fromEntries(
      Object.entries(schema.responses).map(([key, value]) => {
        return [
          key,
          value ? (zodToJsonSchema(value, { errorMessages: true }) as JSONSchema7) : undefined,
        ]
      })
    ) as Partial<Record<ApiHttpStatus, JSONSchema7>>,
  }

  if (schema.method === 'GET') {
    return template as ClientApiRouteSchema
  }

  return {
    ...template,
    body: schema.body
      ? (zodToJsonSchema(schema.body, { errorMessages: true }) as JSONSchema7)
      : undefined,
  } as ClientApiRouteSchema
}
