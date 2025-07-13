import type { Many, Table } from 'drizzle-orm'
import type { ConditionalExcept, IsEqual, Simplify, ValueOf } from 'type-fest'
import z from 'zod/v4'

import type { FieldBase } from '.'
import { getFieldsClient } from './config'
import type { AnyContextable, AnyRequestContextable } from './context'
import { type AnyApiRouter, type ApiRoute, createEndpoint } from './endpoint'
import {
  type FieldClient,
  type FieldColumn,
  type FieldMutateModeCollection,
  type FieldOptionsBase,
  type FieldRelation,
  type FieldRelationBase,
  type FieldRelationConnect,
  type FieldRelationConnectOrCreate,
  type FieldRelationCreate,
  type Fields,
  type FieldsClient,
  fieldsToZodObject,
} from './field'
import { type ToZodObject } from './utils'

type SimplifyConditionalExcept<Base, Condition> = Simplify<ConditionalExcept<Base, Condition>>

export const ApiDefaultMethod = {
  CREATE: 'create',
  FIND_ONE: 'findOne',
  FIND_MANY: 'findMany',
  UPDATE: 'update',
  DELETE: 'delete',
} as const
export type ApiDefaultMethod = (typeof ApiDefaultMethod)[keyof typeof ApiDefaultMethod]

export type MaybePromise<T> = T | Promise<T>

export type ActivateFieldMutateMode<
  TType,
  TField extends FieldOptionsBase,
  TMethod extends 'create' | 'update' | undefined = undefined,
> = TMethod extends keyof TField
  ? TField[TMethod] extends FieldMutateModeCollection['HIDDEN']
    ? never
    : TType
  : TType

/**
 * For updating a single relation field. There's 2 scenarios to consider for One relations:
 * 1. User creates a new relation with given data. For example, creating a new role for a user. The payload would be:
 *    ```ts
 *    {
 *      id: "userid_1",
 *      data: {
 *        name: "New Name 1",
 *        role: {
 *          create: {
 *            roleId: "role_2",
 *            color: "red"
 *          },
 *          disconnect: "user_role_1"
 *        }
 *      }
 *    }
 *    ```
 *
 *
 *    Many User can have One Role. This means that the user "userid_1" is creating a new relation with the Role "role_2" and disconnecting the relation with "user_role_1".
 *    It does not mean that user "userid_1" deleted the role.
 *
 * 2. User updates an existing relation with given data. For example, adding a post to a existing category. The payload would be:
 *    ```ts
 *    {
 *      id: "post_1",
 *      data: {
 *        name: "New Post 1",
 *        category: {
 *          connect: "category_1",
 *          disconnect: "category_2"
 *        }
 *      }
 *    }
 *    ```
 *
 *    Many Post can have One Category. This means that the user "post_1" is connecting the relation with "category_1".
 */
export type InferOneRelationMutationField<TField extends FieldRelationBase> = {
  create?: TField extends FieldRelationCreate | FieldRelationConnectOrCreate
    ? InferCreateFields<TField['fields']>
    : never
  connect?: TField['$server']['primaryColumn']['_']['data']
  disconnect?: TField['$server']['primaryColumn']['_']['data']
}

/**
 * For updating a single relation field. There's 2 scenarios to consider for Many relations:
 * 1. User assigns a new user to a role. The payload would be:
 * ```ts
 *    {
 *      id: "role_1",
 *      data: {
 *        name: "New Role 1",
 *        role: {
 *          connect: [{ id: "user_1" }, { id: "user_2"}],
 *          disconnect: ["user_3"]
 *        }
 *        role: [
 *          { connect: { id: "user_1" } }
 *          { connect: { id: "user_2" } }
 *          { disconnect: { id: "user_3" } }
 *        ]
 *      }
 *    }
 * ```
 *
 *    One Role can have Many Users. This means that the user "role_1" is connecting the relation with "user_1"
 *    and "user_2" and disconnecting the relation with "user_3".
 *
 * 2. User assigns new tags to a post. The payload would be:
 * ```ts
 *    {
 *      id: "post_1",
 *      name: "Post 1",
 *      tags: [
 *        { create: { tagId: "tag_1" } },
 *        { create: { tagId: "tag_2" } },
 *        { connect: { id: "post_tag_1" } },
 *        { connect: {id: "post_tag_2" } },
 *        { disconnect: { id: "post_tag_3" } },
 *      ]
 *   }
 * ```
 *
 *   One Post can have Many PostTags. This means that the user "post_1" is connecting the relation with "category_1".
 */
export type InferManyRelationMutationField<TField extends FieldRelationBase> = Array<
  InferOneRelationMutationField<TField>
>

type PickFromArrayOrObject<TArrayOrObject, TKeys extends string> =
  TArrayOrObject extends Array<any>
    ? Array<Pick<TArrayOrObject[number], TKeys>>
    : TArrayOrObject extends Record<string, any>
      ? Pick<TArrayOrObject, TKeys>
      : never

export type InferMutationRelationField<TField extends FieldRelationBase> =
  TField['$server']['relation'] extends Many<any>
    ? Simplify<InferManyRelationMutationField<TField>>
    : Simplify<InferOneRelationMutationField<TField>>

export type InferUpdateField<TField extends FieldBase> = TField extends FieldRelationBase
  ? TField extends FieldRelationCreate
    ? Simplify<PickFromArrayOrObject<InferMutationRelationField<TField>, 'create' | 'disconnect'>>
    : TField extends FieldRelationConnect
      ? Simplify<
          PickFromArrayOrObject<InferMutationRelationField<TField>, 'connect' | 'disconnect'>
        >
      : TField extends FieldRelationConnectOrCreate
        ? Simplify<InferMutationRelationField<TField>>
        : never
  : TField extends FieldColumn<any>
    ? ActivateFieldMutateMode<TField['$server']['column']['_']['data'], TField, 'update'>
    : never

export type InferUpdateFields<TFields extends Fields> = SimplifyConditionalExcept<
  {
    [TKey in keyof TFields]: TFields[TKey] extends FieldBase
      ? Simplify<InferUpdateField<TFields[TKey]>>
      : never
  },
  never
>

export type InferCreateField<TField extends FieldBase> = TField extends FieldRelationBase
  ? TField extends FieldRelationCreate
    ? Simplify<PickFromArrayOrObject<InferMutationRelationField<TField>, 'create'>>
    : TField extends FieldRelationConnect
      ? Simplify<PickFromArrayOrObject<InferMutationRelationField<TField>, 'connect'>>
      : TField extends FieldRelationConnectOrCreate
        ? Simplify<PickFromArrayOrObject<InferMutationRelationField<TField>, 'create' | 'connect'>>
        : never
  : TField extends FieldColumn<any>
    ? ActivateFieldMutateMode<TField['$server']['column']['_']['data'], TField, 'create'>
    : never

export type InferCreateFields<TFields extends Fields> = SimplifyConditionalExcept<
  {
    [TKey in keyof TFields]: TFields[TKey] extends FieldBase
      ? InferCreateField<TFields[TKey]>
      : never
  },
  never
>

export type InferRelationField<TField extends FieldRelation<any>> =
  TField['$server']['relation'] extends Many<any>
    ? InferManyRelationMutationField<TField>
    : InferOneRelationMutationField<TField>

/**
 * Infer the type of a field based on the field type and the method.
 * For example,
 *
 * ```ts
 * const userField = builder.fields('users', (fb) => ({
 *   id: fb.columns('id', { type: 'text' }),
 *   profile: fb.columns('email', { type: 'media' }),
 *   age: fb.columns('age', { type: 'number' }),
 *   roles: fb.relation('roles', {
 *      type: "connect",
 *      fields: fb.fields('roles', (fb) => ({
 *        id: fb.columns('id', { type: 'text' }),
 *        name: fb.columns('userId', { type: 'text' }),
 *      })
 *   }),
 *   rules: fb.relation('roles', {
 *      type: "connect",
 *      orderField: "order",
 *      display: (field) => { label: field.name; value: field.id },
 *      fields: fb.fields('rules', (fb) => ({
 *        id: fb.columns('id', { type: 'text' }),
 *        name: fb.columns('userId', { type: 'text' }),
 *      })
 *   }),
 *   organization: fb.relation('organization', {
 *      type: "connect",
 *      display: (field) => { label: field.name; value: field.id },
 *      fields: fb.fields('organization', (fb) => ({
 *        id: fb.columns('id', { type: 'text' }),
 *        name: fb.columns('userId', { type: 'text' }),
 *      })
 *   })
 * })
 *
 * type UserId = InferField<(typeof userField)["id"],> // => string
 * type UserProfile = InferField<(typeof userField)["profile"],> // => string
 * type UserAge = InferField<(typeof userField)["age"],> // => number
 * type UserRoles = InferField<(typeof userField)["roles"],> // => { __pk: string; __order: string; name: string; roleId: string }[]
 * type UserRules = InferField<(typeof userField)["rules"],> // => { __pk: string; name: string; roleId: string }[]
 * type UserOrganization = InferField<(typeof userField)["organization"],> // => { __pk: string; name: string; roleId: string }
 * ```
 */
export type InferField<TField extends FieldClient> =
  TField extends FieldRelation<any>
    ? TField['$server']['relation'] extends Many<any>
      ? // TODO: Order field
        Array<Simplify<InferFields<TField['fields']>>>
      : Simplify<InferFields<TField['fields']>>
    : TField extends FieldColumn<any>
      ? TField['$server']['column']['_']['data']
      : never

/**
 * Infer the type of all fields in a collection based on the field type and the method.
 * For example,
 *
 * ```ts
 * const userField = builder.fields('users', (fb) => ({
 *   id: fb.columns('id', { type: 'text' }),
 *   profile: fb.columns('email', { type: 'media' }),
 *   age: fb.columns('age', { type: 'number' }),
 *   roles: fb.relation('roles', {
 *      type: "connect",
 *      display: (field) => { label: field.name; value: field.id },
 *      fields: fb.fields('roles', (fb) => ({
 *        id: fb.columns('id', { type: 'text' }),
 *        name: fb.columns('userId', { type: 'text' }),
 *      })
 *   }),
 *   organization: fb.relation('organization', {
 *      type: "connect",
 *      display: (field) => { label: field.name; value: field.id },
 *      fields: fb.fields('organization', (fb) => ({
 *        id: fb.columns('id', { type: 'text' }),
 *        name: fb.columns('userId', { type: 'text' }),
 *      })
 *   })
 * })
 *
 * type UserFields = InferFields<typeof userField> // => { __pk: string | number; __id: string | number; id: string; profile: string; age: number }
 * ```
 */
export type InferFields<TFields extends Fields> = SimplifyConditionalExcept<
  {
    [TKey in keyof TFields]: TFields[TKey] extends FieldClient
      ? TFields[TKey] extends FieldColumn<any>
        ? Simplify<InferField<TFields[TKey]>>
        : // NOTE: This is to remove the __id field from the relation fields
          Simplify<Omit<InferField<TFields[TKey]>, '__id'>>
      : never
  },
  never
> & { __pk: string | number; __id: string | number }

export interface ServerApiHandlerArgs<TFields extends Fields> {
  slug: string
  fields: TFields
  context: AnyRequestContextable
}

export type ApiArgs<
  TMethod extends ApiDefaultMethod,
  TFields extends Fields,
> = TMethod extends typeof ApiDefaultMethod.CREATE
  ? ServerApiHandlerArgs<TFields> & ApiCreateArgs<TFields>
  : TMethod extends typeof ApiDefaultMethod.FIND_ONE
    ? ServerApiHandlerArgs<TFields> & ApiFindOneArgs
    : TMethod extends typeof ApiDefaultMethod.FIND_MANY
      ? ServerApiHandlerArgs<TFields> & ApiFindManyArgs
      : TMethod extends typeof ApiDefaultMethod.UPDATE
        ? ServerApiHandlerArgs<TFields> & ApiUpdateArgs<TFields>
        : TMethod extends typeof ApiDefaultMethod.DELETE
          ? ServerApiHandlerArgs<TFields> & ApiDeleteArgs
          : never

export type ApiReturnType<
  TMethod extends ApiDefaultMethod,
  TFields extends Fields,
> = TMethod extends typeof ApiDefaultMethod.CREATE
  ? { __pk: string | number; __id: string | number }
  : TMethod extends typeof ApiDefaultMethod.FIND_ONE
    ? InferFields<TFields>
    : TMethod extends typeof ApiDefaultMethod.FIND_MANY
      ? { data: InferFields<TFields>[]; total: number; page: number }
      : TMethod extends typeof ApiDefaultMethod.UPDATE
        ? { __pk: string | number; __id: string | number }
        : TMethod extends typeof ApiDefaultMethod.DELETE
          ? void
          : never

export type ApiFindOneArgs = {
  // This should be the primary field of the collection e.g. __pk or username
  id: string | number
}

export type ApiFindManyArgs = {
  limit?: number
  offset?: number
  orderBy?: string
  orderType?: 'asc' | 'desc'
}

export type ApiCreateArgs<TFields extends Fields> = {
  data: InferCreateFields<TFields>
}

export type ApiHandlerFn<
  TContext extends AnyContextable,
  TFields extends Fields,
  TMethod extends ApiDefaultMethod,
> = (args: ApiArgs<TMethod, TFields>) => MaybePromise<ApiReturnType<TMethod, TFields>>

export type ApiUpdateArgs<TFields extends Fields> = {
  // This should be the primary field of the collection e.g. __pk or username
  id: string | number
  data: InferUpdateFields<TFields>
}

export type ApiDeleteArgs = {
  ids: string[] | number[]
}

export type ClientApiArgs<
  TMethod extends ApiDefaultMethod,
  TFields extends Fields,
> = TMethod extends typeof ApiDefaultMethod.CREATE
  ? ApiCreateArgs<TFields>
  : TMethod extends typeof ApiDefaultMethod.FIND_ONE
    ? ApiFindOneArgs
    : TMethod extends typeof ApiDefaultMethod.FIND_MANY
      ? ApiFindManyArgs
      : TMethod extends typeof ApiDefaultMethod.UPDATE
        ? ApiUpdateArgs<TFields>
        : TMethod extends typeof ApiDefaultMethod.DELETE
          ? ApiDeleteArgs
          : never

export type ApiConfigHandlerFn<
  TContext extends AnyContextable,
  TFields extends Fields,
  TMethod extends ApiDefaultMethod,
> = (
  args: ApiArgs<TMethod, TFields> & {
    defaultApi: ApiHandlerFn<TContext, TFields, TMethod>
  }
) => MaybePromise<ApiReturnType<TMethod, TFields>>

export type CollectionAdminApiOptions<TContext extends AnyContextable, TFields extends Fields> = {
  create?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.CREATE>
  findOne?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_ONE>
  findMany?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_MANY>
  update?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.UPDATE>
  delete?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.DELETE>
}

export type CollectionAdminApi<TContext extends AnyContextable, TFields extends Fields> = {
  create: ApiHandlerFn<TContext, TFields, typeof ApiDefaultMethod.CREATE>
  findOne: ApiHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_ONE>
  findMany: ApiHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_MANY>
  update: ApiHandlerFn<TContext, TFields, typeof ApiDefaultMethod.UPDATE>
  delete: ApiHandlerFn<TContext, TFields, typeof ApiDefaultMethod.DELETE>
}

export type CollectionAdminOptions<
  TContext extends AnyContextable,
  TFields extends Fields,
  TApiRouter extends AnyApiRouter,
> = {
  api?: CollectionAdminApiOptions<TContext, TFields>
  endpoints?: TApiRouter
}

export type GetUniqueNotNullColumnNames<TTable extends Table> = ValueOf<{
  // TODO: Currently, drizzle-orm does not provide a way to get unique and not null columns
  // This fix this after the PR was merged: https://github.com/drizzle-team/drizzle-orm/pull/4567
  [TColumnName in keyof TTable['_']['columns'] as TTable['_']['columns'][TColumnName]['_']['notNull'] extends true
    ? TColumnName
    : never]: TColumnName
}>

export interface CollectionOptions<
  TSlug extends string,
  TContext extends AnyContextable,
  TFields extends Fields,
  TAppRouter extends AnyApiRouter,
> {
  // TODO: This should not exists, "fields" should know about this informaation. Need to refactor
  slug: TSlug
  identifierColumn: string
  fields: TFields
  admin?: CollectionAdminOptions<TContext, TFields, TAppRouter>
}

export interface CollectionOptionsClient {
  slug: string
  identifierColumn: string
  fields: FieldsClient
}

export type GetAllTableTsNames<TFullSchema extends Record<string, unknown>> = Extract<
  {
    [TKey in keyof TFullSchema]: TFullSchema[TKey] extends Table<any> ? TKey : never
  }[keyof TFullSchema],
  string
>

export type ConditionalAnyOutput<TFields extends Fields, TOutput> =
  IsEqual<TFields, Fields> extends true ? any : TOutput

export type ConvertCollectionDefaultApiToApiRouteSchema<
  TSlug extends string,
  TMethod extends ApiDefaultMethod,
  TFields extends Fields,
> = TMethod extends typeof ApiDefaultMethod.CREATE
  ? {
      path: `/api/${TSlug}/${TMethod}`
      method: 'POST'
      body: ConditionalAnyOutput<TFields, ToZodObject<InferCreateFields<TFields>>>
      responses: {
        200: ConditionalAnyOutput<TFields, ToZodObject<ApiReturnType<TMethod, TFields>>>
      }
    }
  : TMethod extends typeof ApiDefaultMethod.FIND_ONE
    ? {
        path: `/api/${TSlug}/:id`
        method: 'GET'
        pathParams: ToZodObject<{ id: string }>
        responses: {
          200: ConditionalAnyOutput<TFields, ToZodObject<ApiReturnType<TMethod, TFields>>>
        }
      }
    : TMethod extends typeof ApiDefaultMethod.FIND_MANY
      ? {
          path: `/api/${TSlug}`
          method: 'GET'
          query: ToZodObject<{
            limit?: number
            offset?: number
            orderBy?: string
            orderType?: 'asc' | 'desc'
          }>
          responses: {
            200: ConditionalAnyOutput<TFields, ToZodObject<ApiReturnType<TMethod, TFields>>>
          }
        }
      : TMethod extends typeof ApiDefaultMethod.UPDATE
        ? {
            path: `/api/${TSlug}/:id`
            method: 'PATCH'
            pathParams: ToZodObject<{ id: string }>
            body: ConditionalAnyOutput<TFields, ToZodObject<InferUpdateFields<TFields>>>
            responses: {
              200: ToZodObject<ApiReturnType<TMethod, TFields>>
            }
          }
        : TMethod extends typeof ApiDefaultMethod.DELETE
          ? {
              path: `/api/${TSlug}`
              method: 'DELETE'
              body: ToZodObject<{ ids: string[] | number[] }>
              responses: {
                // TODO: recheck this
                200: ToZodObject<{}>
              }
            }
          : never

export type CollectionDefaultAdminApiRouter<TSlug extends string, TFields extends Fields> = {
  create: ApiRoute<
    ConvertCollectionDefaultApiToApiRouteSchema<TSlug, typeof ApiDefaultMethod.CREATE, TFields>
  >
  findOne: ApiRoute<
    ConvertCollectionDefaultApiToApiRouteSchema<TSlug, typeof ApiDefaultMethod.FIND_ONE, TFields>
  >
  findMany: ApiRoute<
    ConvertCollectionDefaultApiToApiRouteSchema<TSlug, typeof ApiDefaultMethod.FIND_MANY, TFields>
  >
  update: ApiRoute<
    ConvertCollectionDefaultApiToApiRouteSchema<TSlug, typeof ApiDefaultMethod.UPDATE, TFields>
  >
  delete: ApiRoute<
    ConvertCollectionDefaultApiToApiRouteSchema<TSlug, typeof ApiDefaultMethod.DELETE, TFields>
  >
}

export function getDefaultCollectionAdminApiRouter(
  context: AnyContextable,
  slug: string,
  fields: Fields,
  defaultHandler: CollectionAdminApiOptions<AnyContextable, Fields>
): CollectionDefaultAdminApiRouter<string, Fields> {
  return Object.fromEntries(
    Object.entries(defaultHandler).map(([method, fn]) => {
      const endpointName = method
      switch (method) {
        case ApiDefaultMethod.CREATE: {
          // TODO: Create ApiRouteSchema from fields and method
          const body = fieldsToZodObject(fields as any, ApiDefaultMethod.CREATE)

          const endpoint = createEndpoint(
            context,
            {
              path: `/api/${slug}/${method}`,
              method: 'POST',
              // TODO: fieldToZodObject but create fields
              body: body,
              responses: {
                200: z.object({
                  __pk: z.union([z.string(), z.number()]),
                  __id: z.union([z.string(), z.number()]),
                }),
              },
            },
            async (args) => {
              const response = await (fn as ApiHandlerFn<any, any, typeof method>)({
                slug: slug,
                fields: fields,
                context: args.context,
                data: args.body,
              })
              return { status: 200, body: response }
            }
          )

          return [endpointName, endpoint]
        }
        case ApiDefaultMethod.FIND_ONE: {
          const response = fieldsToZodObject(fields as any)

          const endpoint = createEndpoint(
            context,
            {
              path: `/api/${slug}/${method}/:id`,
              method: 'GET',
              pathParams: z.object({
                id: z.union([z.string(), z.number()]),
              }),
              responses: {
                200: response,
              },
            },
            async (args) => {
              const response = await (fn as ApiHandlerFn<any, any, typeof method>)({
                slug: slug,
                fields: fields,
                context: args.context,
                id: args.pathParams.id,
              })
              return { status: 200, body: response }
            }
          )

          return [endpointName, endpoint]
        }
        case ApiDefaultMethod.FIND_MANY: {
          const body = fieldsToZodObject(fields as any)
          const response = z.object({
            data: z.array(body),
            total: z.number(),
            page: z.number(),
          })

          const endpoint = createEndpoint(
            context,
            {
              path: `/api/${slug}/${method}`,
              method: 'GET',
              query: z.object({
                limit: z.number().optional(),
                offset: z.number().optional(),
                orderBy: z.string().optional(),
                orderType: z.enum(['asc', 'desc']).optional(),
              }),
              responses: {
                200: response,
              },
            },
            async (args) => {
              const response = await (fn as ApiHandlerFn<any, any, typeof method>)({
                slug: slug,
                fields: fields,
                context: args.context,
                limit: args.query.limit,
                offset: args.query.offset,
                orderBy: args.query.orderBy,
                orderType: args.query.orderType,
              })
              return { status: 200, body: response }
            }
          )

          return [endpointName, endpoint]
        }
        case ApiDefaultMethod.UPDATE: {
          const body = fieldsToZodObject(fields as any, ApiDefaultMethod.UPDATE)

          const endpoint = createEndpoint(
            context,
            {
              path: `/api/${slug}/${method}/:id`,
              method: 'PATCH',
              pathParams: z.object({
                id: z.union([z.string(), z.number()]),
              }),
              // TODO: fieldToZodObject but update fields
              body: body,
              responses: {
                200: z.object({
                  __pk: z.union([z.string(), z.number()]),
                  __id: z.union([z.string(), z.number()]),
                }),
              },
            },
            async (args) => {
              const response = await (fn as ApiHandlerFn<any, any, typeof method>)({
                slug: slug,
                fields: fields,
                context: args.context,
                id: args.pathParams.id,
                data: args.body as any, // TODO: Fix this
              })
              return { status: 200, body: response }
            }
          )

          return [endpointName, endpoint]
        }
        case ApiDefaultMethod.DELETE: {
          const endpoint = createEndpoint(
            context,
            {
              path: `/api/${slug}/${method}`,
              method: 'DELETE',
              body: z.object({
                ids: z.union([z.string().array(), z.number().array()]),
              }),
              responses: {
                200: z.object({ message: z.string() }),
              },
            },
            async (args) => {
              await (fn as ApiHandlerFn<any, any, typeof method>)({
                slug,
                fields,
                context: args.context,
                ids: args.body.ids,
              })
              return { status: 200, body: { message: 'ok' } }
            }
          )

          return [endpointName, endpoint]
        }
        default: {
          throw new Error(`Unknown method ${method} for collection ${slug}`)
        }
      }
    })
  )
}

export function getCollectionOptionsClient<TContext extends AnyContextable, TFields extends Fields>(
  collectionOptions: Omit<CollectionOptions<string, TContext, TFields, any>, 'admin'>
): CollectionOptionsClient {
  return {
    slug: collectionOptions.slug,
    identifierColumn: collectionOptions.identifierColumn,
    fields: getFieldsClient(collectionOptions.fields),
  }
}
