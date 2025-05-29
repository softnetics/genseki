import type { Many, Table, TableRelationalConfig } from 'drizzle-orm'
import type { ConditionalExcept, Simplify, UnionToIntersection, ValueOf } from 'type-fest'
import z from 'zod'

import type { MinimalContext } from './config'
import type { RequestContext } from './context'
import {
  type ApiRoute,
  type ApiRouteHandler,
  type ApiRouter,
  type ApiRouteSchema,
  type ClientApiRouter,
  createEndpoint,
} from './endpoint'
import {
  type Field,
  type FieldClient,
  type FieldColumn,
  type FieldMutateModeCollection,
  type FieldRelation,
  type FieldRelationCollection,
  type Fields,
  type FieldsClient,
  type FieldsInitial,
  fieldsToZodObject,
  type FieldsWithFieldName,
} from './field'
import { type GetTableByTableTsName, type ToZodObject } from './utils'

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
  TField extends FieldClient,
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
export type InferOneRelationMutationField<TField extends FieldRelation<any>> = {
  create?: TField extends FieldRelationCollection<any>['create' | 'connectOrCreate']
    ? InferCreateFields<TField['fields']>
    : never
  connect?: TField['_']['primaryColumn']['_']['data']
  disconnect?: TField['_']['primaryColumn']['_']['data']
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
export type InferManyRelationMutationField<TField extends FieldRelation<any>> = Array<
  InferOneRelationMutationField<TField>
>

type PickFromArrayOrObject<TArrayOrObject, TKeys extends string> =
  TArrayOrObject extends Array<any>
    ? Array<Pick<TArrayOrObject[number], TKeys>>
    : TArrayOrObject extends Record<string, any>
      ? Pick<TArrayOrObject, TKeys>
      : never

export type InferMutationRelationField<TField extends FieldRelation<any>> =
  TField['_']['relation'] extends Many<any>
    ? Simplify<InferManyRelationMutationField<TField>>
    : Simplify<InferOneRelationMutationField<TField>>

export type InferUpdateField<TField extends Field<any>> =
  TField extends FieldRelation<any>
    ? TField extends FieldRelationCollection<any>['create']
      ? Simplify<PickFromArrayOrObject<InferMutationRelationField<TField>, 'create' | 'disconnect'>>
      : TField extends FieldRelationCollection<any>['connect']
        ? Simplify<
            PickFromArrayOrObject<InferMutationRelationField<TField>, 'connect' | 'disconnect'>
          >
        : TField extends FieldRelationCollection<any>['connectOrCreate']
          ? Simplify<InferMutationRelationField<TField>>
          : never
    : TField extends FieldColumn<any>
      ? ActivateFieldMutateMode<TField['_']['column']['_']['data'], TField, 'update'>
      : never

export type InferUpdateFields<TFields extends Fields<any>> = SimplifyConditionalExcept<
  {
    [TKey in keyof TFields]: TFields[TKey] extends Field<any>
      ? Simplify<InferUpdateField<TFields[TKey]>>
      : never
  },
  never
>

export type InferCreateField<TField extends Field<any>> =
  TField extends FieldRelation<any>
    ? TField extends FieldRelationCollection<any>['create']
      ? Simplify<PickFromArrayOrObject<InferMutationRelationField<TField>, 'create'>>
      : TField extends FieldRelationCollection<any>['connect']
        ? Simplify<PickFromArrayOrObject<InferMutationRelationField<TField>, 'connect'>>
        : TField extends FieldRelationCollection<any>['connectOrCreate']
          ? Simplify<
              PickFromArrayOrObject<InferMutationRelationField<TField>, 'create' | 'connect'>
            >
          : never
    : TField extends FieldColumn<any>
      ? ActivateFieldMutateMode<TField['_']['column']['_']['data'], TField, 'create'>
      : never

export type InferCreateFields<TFields extends Fields<any>> = SimplifyConditionalExcept<
  {
    [TKey in keyof TFields]: TFields[TKey] extends Field<any>
      ? InferCreateField<TFields[TKey]>
      : never
  },
  never
>

export type InferRelationField<TField extends FieldRelation<any>> =
  TField['_']['relation'] extends Many<any>
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
    ? TField['_']['relation'] extends Many<any>
      ? // TODO: Order field
        Array<Simplify<InferFields<TField['fields']>>>
      : Simplify<InferFields<TField['fields']>>
    : TField extends FieldColumn<any>
      ? TField['_']['column']['_']['data']
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
export type InferFields<TFields extends FieldsClient> = SimplifyConditionalExcept<
  {
    [TKey in keyof TFields]: TFields[TKey] extends FieldClient
      ? TFields[TKey] extends FieldColumn<any>
        ? Simplify<InferField<TFields[TKey]>>
        : // NOTE: This is to remove the __id field from the relation fields
          Simplify<Omit<InferField<TFields[TKey]>, '__id'>>
      : never
  } & {
    __pk: string | number
    __id: string | number
  },
  never
>

export type ServerApiHandlerArgs<
  TContext extends MinimalContext = MinimalContext,
  TFields extends Fields<TContext> = Fields<TContext>,
> = {
  slug: string
  fields: TFields
  requestContext: RequestContext<TContext>
}

export type ApiArgs<
  TMethod extends ApiDefaultMethod,
  TContext extends MinimalContext,
  TFields extends Fields<TContext>,
> = TMethod extends typeof ApiDefaultMethod.CREATE
  ? ServerApiHandlerArgs<TContext, TFields> & ApiCreateArgs<TFields>
  : TMethod extends typeof ApiDefaultMethod.FIND_ONE
    ? ServerApiHandlerArgs<TContext, TFields> & ApiFindOneArgs
    : TMethod extends typeof ApiDefaultMethod.FIND_MANY
      ? ServerApiHandlerArgs<TContext, TFields> & ApiFindManyArgs
      : TMethod extends typeof ApiDefaultMethod.UPDATE
        ? ServerApiHandlerArgs<TContext, TFields> & ApiUpdateArgs<TFields>
        : TMethod extends typeof ApiDefaultMethod.DELETE
          ? ServerApiHandlerArgs<TContext, TFields> & ApiDeleteArgs
          : never

export type ApiReturnType<
  TMethod extends ApiDefaultMethod,
  TFields extends Fields<any>,
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

export type ApiFindOneHandler<TContext extends MinimalContext, TFields extends Fields<TContext>> = (
  args: ApiArgs<typeof ApiDefaultMethod.FIND_ONE, TContext, TFields>
) => MaybePromise<ApiReturnType<typeof ApiDefaultMethod.FIND_ONE, TFields>>

export type ApiFindManyArgs = {
  limit?: number
  offset?: number
  orderBy?: string
  orderType?: 'asc' | 'desc'
}

export type ApiFindManyHandler<
  TContext extends MinimalContext,
  TFields extends Fields<TContext>,
> = (
  args: ApiArgs<typeof ApiDefaultMethod.FIND_MANY, TContext, TFields>
) => MaybePromise<ApiReturnType<typeof ApiDefaultMethod.FIND_MANY, TFields>>

export type ApiCreateArgs<TFields extends Fields<any>> = {
  data: InferCreateFields<TFields>
}

export type ApiCreateHandler<TContext extends MinimalContext, TFields extends Fields<TContext>> = (
  args: ApiArgs<typeof ApiDefaultMethod.CREATE, TContext, TFields>
) => MaybePromise<ApiReturnType<typeof ApiDefaultMethod.CREATE, TFields>>

export type ApiUpdateArgs<TFields extends Fields<any>> = {
  // This should be the primary field of the collection e.g. __pk or username
  id: string | number
  data: InferUpdateFields<TFields>
}

export type ApiUpdateHandler<TContext extends MinimalContext, TFields extends Fields<TContext>> = (
  args: ApiArgs<typeof ApiDefaultMethod.UPDATE, TContext, TFields>
) => MaybePromise<ApiReturnType<typeof ApiDefaultMethod.UPDATE, TFields>>

export type ApiDeleteArgs = {
  ids: string[] | number[]
}

export type ApiDeleteHandler<TContext extends MinimalContext, TFields extends Fields<TContext>> = (
  args: ApiArgs<typeof ApiDefaultMethod.DELETE, TContext, TFields>
) => MaybePromise<ApiReturnType<typeof ApiDefaultMethod.DELETE, TFields>>

export type ClientApiArgs<
  TMethod extends ApiDefaultMethod,
  TFields extends Fields<any>,
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

export type CollectionAdminApiConfig<
  TContext extends MinimalContext = MinimalContext,
  TFields extends Fields<TContext> = Fields<TContext>,
> = {
  create?: ApiCreateHandler<TContext, TFields>
  findOne?: ApiFindOneHandler<TContext, TFields>
  findMany?: ApiFindManyHandler<TContext, TFields>
  update?: ApiUpdateHandler<TContext, TFields>
  delete?: ApiDeleteHandler<TContext, TFields>
}

export type CollectionAdminApi<
  TContext extends MinimalContext = MinimalContext,
  TFields extends Fields<TContext> = Fields<TContext>,
> = {
  create: ApiCreateHandler<TContext, TFields>
  findOne: ApiFindOneHandler<TContext, TFields>
  findMany: ApiFindManyHandler<TContext, TFields>
  update: ApiUpdateHandler<TContext, TFields>
  delete: ApiDeleteHandler<TContext, TFields>
}

export type CollectionAdminConfig<
  TContext extends MinimalContext = MinimalContext,
  TFields extends Fields<TContext> = Fields<TContext>,
  TApiRouter extends ApiRouter<TContext> = ApiRouter<TContext>,
> = {
  api?: CollectionAdminApiConfig<TContext, TFields>
  endpoints?: TApiRouter
}

export type CollectionAdmin<
  TContext extends MinimalContext = MinimalContext,
  TFields extends Fields<TContext> = Fields<TContext>,
  TApiRouter extends ApiRouter<TContext> = ApiRouter<TContext>,
> = {
  api: CollectionAdminApi<TContext, TFields>
  endpoints: TApiRouter
}

export type GetUniqueNotNullColumnNames<TTable extends Table> = ValueOf<{
  // TODO: Currently, drizzle-orm does not provide a way to get unique and not null columns
  // This fix this after the PR was merged: https://github.com/drizzle-team/drizzle-orm/pull/4567
  [TColumnName in keyof TTable['_']['columns'] as TTable['_']['columns'][TColumnName]['_']['notNull'] extends true
    ? TColumnName
    : never]: TColumnName
}>

export type CollectionConfig<
  TSlug extends string = string,
  TTable extends Table = Table,
  TContext extends MinimalContext = MinimalContext,
  TFields extends FieldsInitial<TContext> = FieldsInitial<TContext>,
  TAppRouter extends ApiRouter<TContext> = {},
> = {
  slug: TSlug
  identifierColumn: GetUniqueNotNullColumnNames<TTable>
  fields: TFields
  admin?: CollectionAdminConfig<TContext, FieldsWithFieldName<TFields>, TAppRouter>
}

export type Collection<
  TSlug extends string = string,
  TTableName extends string = string,
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends MinimalContext = MinimalContext,
  TFields extends Fields<TContext> = Fields<TContext>,
  TApiRouter extends ApiRouter<TContext> = {},
> = {
  _: {
    table: GetTableByTableTsName<TFullSchema, TTableName>
    tableConfig: TableRelationalConfig
  }
  slug: TSlug
  identifierColumn: string
  fields: TFields
  admin: CollectionAdmin<TContext, TFields, TApiRouter>
}

export type ToClientCollection<TCollection extends Collection<any, any, any, any, any, any>> =
  ClientCollection<
    InferSlugFromCollection<TCollection>,
    InferTableNameFromCollection<TCollection>,
    InferFullSchemaFromCollection<TCollection>,
    InferContextFromCollection<TCollection>,
    InferFieldsFromCollection<TCollection>,
    InferApiRouterFromCollection<TCollection>
  >

export type ToClientCollectionList<
  TCollections extends Record<string, Collection<any, any, any, any, any, any>>,
> = {
  [TKey in keyof TCollections]: TCollections[TKey] extends Collection<any, any, any, any, any, any>
    ? ToClientCollection<TCollections[TKey]>
    : never
}

// TODO: proper omit
export type ClientCollection<
  TSlug extends string = string,
  TTableName extends string = any,
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends MinimalContext = any,
  TFields extends Record<string, FieldClient> = Record<string, FieldClient>,
  TEndpoints extends ClientApiRouter = {},
> = Simplify<
  Omit<Collection<TSlug, TTableName, TFullSchema, TContext, any>, 'fields'> & {
    fields: TFields
    _: {
      $endpoints: TEndpoints
    }
  }
>

export type InferSlugFromCollection<TCollection extends Collection<any, any, any, any, any, any>> =
  TCollection['slug']

export type InferTableNameFromCollection<
  TCollection extends Collection<any, any, any, any, any, any>,
> = TCollection extends Collection<any, infer TTableName, any, any, any, any> ? TTableName : never

export type InferFullSchemaFromCollection<
  TCollection extends Collection<any, any, any, any, any, any>,
> = TCollection extends Collection<any, any, infer TFullSchema, any, any, any> ? TFullSchema : never

export type InferContextFromCollection<
  TCollection extends Collection<any, any, any, any, any, any>,
> = TCollection extends Collection<any, any, any, infer TContext, any, any> ? TContext : never

export type InferFieldsFromCollection<
  TCollection extends Collection<any, any, any, any, any, any>,
> = TCollection extends Collection<any, any, any, any, infer TFields, any> ? TFields : never

export type InferApiRouterFromCollection<
  TCollection extends Collection<any, any, any, any, any, any>,
> = TCollection extends Collection<any, any, any, any, any, infer TApiRouter> ? TApiRouter : never

export type FindTableByTableTsName<
  TFullSchema extends Record<string, unknown>,
  TTableTsName extends keyof TFullSchema,
> = TFullSchema[TTableTsName] extends Table<any> ? TFullSchema[TTableTsName] : never

export type GetAllTableTsNames<TFullSchema extends Record<string, unknown>> = Extract<
  {
    [TKey in keyof TFullSchema]: TFullSchema[TKey] extends Table<any> ? TKey : never
  }[keyof TFullSchema],
  string
>

export type ExtractCollectionCustomEndpoints<
  TCollection extends Collection<any, any, any, any, any, any>,
> = TCollection['admin']['endpoints'] extends infer TEndpoints
  ? TEndpoints extends Record<string, ApiRoute<any, any>>
    ? {
        [TEndpoint in keyof TEndpoints as TEndpoints[TEndpoint]['schema'] extends ApiRouteSchema
          ? `${TCollection['slug']}.${TEndpoint extends string ? TEndpoint : never}`
          : never]: TEndpoints[TEndpoint]
      }
    : never
  : never

export type ExtractAllCollectionCustomEndpoints<
  TCollections extends Record<string, Collection<any, any, any, any, any, any>>,
> = UnionToIntersection<
  ValueOf<{
    [TCollectionIndex in keyof TCollections]: TCollections[TCollectionIndex] extends Collection<
      any,
      any,
      any,
      any,
      any,
      any
    >
      ? ExtractCollectionCustomEndpoints<TCollections[TCollectionIndex]>
      : {}
  }>
>

type SuccessResponse<TFunc extends (...args: any) => any> = ToZodObject<Awaited<ReturnType<TFunc>>>

export type ConvertCollectionDefaultApiToApiRouteSchema<
  TCollection extends Collection<any, any, any, any, any, any>,
  TMethod extends ApiDefaultMethod,
> = TMethod extends typeof ApiDefaultMethod.CREATE
  ? {
      path: `/api/${TCollection['slug']}/${TMethod}`
      method: 'POST'
      body: ToZodObject<InferCreateFields<TCollection['fields']>>
      responses: {
        200: SuccessResponse<TCollection['admin']['api'][TMethod]>
      }
    }
  : TMethod extends typeof ApiDefaultMethod.FIND_ONE
    ? {
        path: `/api/${TCollection['slug']}/${TMethod}/:id`
        method: 'GET'
        pathParams: ToZodObject<{ id: string }>
        responses: {
          200: SuccessResponse<TCollection['admin']['api'][TMethod]>
        }
      }
    : TMethod extends typeof ApiDefaultMethod.FIND_MANY
      ? {
          path: `/api/${TCollection['slug']}/${TMethod}`
          method: 'GET'
          query: ToZodObject<{
            limit?: number
            offset?: number
            orderBy?: string
            orderType?: 'asc' | 'desc'
          }>
          responses: {
            200: SuccessResponse<TCollection['admin']['api'][TMethod]>
          }
        }
      : TMethod extends typeof ApiDefaultMethod.UPDATE
        ? {
            path: `/api/${TCollection['slug']}/${TMethod}/:id`
            method: 'PATCH'
            pathParams: ToZodObject<{ id: string }>
            body: ToZodObject<InferUpdateFields<TCollection['fields']>>
            responses: {
              200: SuccessResponse<TCollection['admin']['api'][TMethod]>
            }
          }
        : TMethod extends typeof ApiDefaultMethod.DELETE
          ? {
              path: `/api/${TCollection['slug']}/${TMethod}`
              method: 'DELETE'
              body: ToZodObject<{ ids: string[] | number[] }>
              responses: {
                200: SuccessResponse<TCollection['admin']['api'][TMethod]>
              }
            }
          : never

export type ExtractCollectionDefaultEndpoints<
  TCollection extends Collection<any, any, any, any, any, any>,
> = {
  [TMethod in Extract<
    keyof TCollection['admin']['api'],
    string
  > as `${TCollection['slug']}.${TMethod}`]: ApiRoute<
    InferContextFromCollection<TCollection>,
    TMethod extends ApiDefaultMethod
      ? ConvertCollectionDefaultApiToApiRouteSchema<TCollection, TMethod>
      : never
  >
}

export type ExtractAllCollectionDefaultEndpoints<
  TCollections extends Record<string, Collection<any, any, any, any, any, any>>,
> = UnionToIntersection<
  ValueOf<{
    [TCollectionIndex in keyof TCollections]: TCollections[TCollectionIndex] extends Collection<
      any,
      any,
      any,
      any,
      any,
      any
    >
      ? ExtractCollectionDefaultEndpoints<TCollections[TCollectionIndex]>
      : {}
  }>
>

export function getAllCollectionEndpoints<
  TCollections extends Record<string, Collection<any, any, any, any, any, any>>,
>(collections: TCollections) {
  const customEndpoints = Object.fromEntries(
    Object.values(collections).flatMap((collection) => {
      const endpoints = collection.admin.endpoints
      if (endpoints) {
        return Object.entries(endpoints).map(([key, value]) => {
          return [[`${collection.slug}.${key}`, value]]
        })
      }
      return []
    })
  )

  const defaultEndpoints = Object.fromEntries(
    Object.values(collections).flatMap((collection) => {
      return Object.entries(collection.admin.api).map(([method, fn]) => {
        const endpointName = `${collection.slug}.${method}`
        const fields = collection.fields
        // TODO: Create ApiRouteSchema from fields and method
        switch (method) {
          case ApiDefaultMethod.CREATE: {
            const body = fieldsToZodObject(fields)

            const schema = {
              path: `/api/${collection.slug}/${method}`,
              method: 'POST',
              // TODO: fieldToZodObject but create fields
              body: body,
              responses: {
                200: z.object({
                  __pk: z.union([z.string(), z.number()]),
                  __id: z.union([z.string(), z.number()]),
                }),
              },
            } satisfies ApiRouteSchema

            const handler: ApiRouteHandler<Record<string, unknown>, typeof schema> = async (
              args
            ) => {
              const response = await (fn as ApiCreateHandler<any, any>)({
                slug: collection.slug,
                fields: collection.fields,
                requestContext: args.requestContext,
                data: args.body,
              })
              return { status: 200, body: response }
            }

            return [
              endpointName,
              createEndpoint(schema, handler) satisfies ApiRoute<any, typeof schema>,
            ]
          }
          case ApiDefaultMethod.FIND_ONE: {
            const response = fieldsToZodObject(fields)

            const schema = {
              path: `/api/${collection.slug}/${method}/:id`,
              method: 'GET',
              pathParams: z.object({
                id: z.union([z.string(), z.number()]),
              }),
              responses: {
                200: response,
              },
            } satisfies ApiRouteSchema

            const handler: ApiRouteHandler<Record<string, unknown>, typeof schema> = async (
              args
            ) => {
              const response = await (fn as ApiFindOneHandler<any, any>)({
                slug: collection.slug,
                fields: collection.fields,
                requestContext: args.requestContext,
                id: args.pathParams.id,
              })
              return { status: 200, body: response }
            }

            return [
              endpointName,
              createEndpoint(schema, handler) satisfies ApiRoute<any, typeof schema>,
            ]
          }
          case ApiDefaultMethod.FIND_MANY: {
            const body = fieldsToZodObject(fields)
            const response = z.object({
              data: z.array(body),
              total: z.number(),
              page: z.number(),
            })

            const schema = {
              path: `/api/${collection.slug}/${method}`,
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
            } satisfies ApiRouteSchema

            const handler: ApiRouteHandler<Record<string, unknown>, typeof schema> = async (
              args
            ) => {
              const response = await (fn as ApiFindManyHandler<any, any>)({
                slug: collection.slug,
                fields: collection.fields,
                requestContext: args.requestContext,
                limit: args.query.limit,
                offset: args.query.offset,
                orderBy: args.query.orderBy,
                orderType: args.query.orderType,
              })
              return { status: 200, body: response }
            }

            return [
              endpointName,
              createEndpoint(schema, handler) satisfies ApiRoute<any, typeof schema>,
            ]
          }
          case ApiDefaultMethod.UPDATE: {
            const body = fieldsToZodObject(fields)

            const schema = {
              path: `/api/${collection.slug}/${method}/:id`,
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
            } satisfies ApiRouteSchema

            const handler: ApiRouteHandler<Record<string, unknown>, typeof schema> = async (
              args
            ) => {
              const response = await (fn as ApiUpdateHandler<any, any>)({
                slug: collection.slug,
                fields: collection.fields,
                requestContext: args.requestContext,
                id: args.pathParams.id,
                data: args.body as any, // TODO: Fix this
              })
              return { status: 200, body: response }
            }

            return [
              endpointName,
              createEndpoint(schema, handler) satisfies ApiRoute<any, typeof schema>,
            ]
          }
          case ApiDefaultMethod.DELETE: {
            const schema = {
              path: `/api/${collection.slug}/${method}`,
              method: 'DELETE',
              body: z.object({
                ids: z.union([z.string().array(), z.number().array()]),
              }),
              responses: {
                200: z.object({ message: z.string() }),
              },
            } satisfies ApiRouteSchema

            const handler: ApiRouteHandler<Record<string, unknown>, typeof schema> = async (
              args
            ) => {
              await (fn as ApiDeleteHandler<any, any>)({
                slug: collection.slug,
                fields: collection.fields,
                requestContext: args.requestContext,
                ids: args.body.ids,
              })
              return { status: 200, body: { message: 'ok' } }
            }

            return [
              endpointName,
              createEndpoint(schema, handler) satisfies ApiRoute<any, typeof schema>,
            ]
          }
          default:
            throw new Error(`Unknown method: ${method}`)
        }
      })
    })
  )

  return {
    ...defaultEndpoints,
    ...customEndpoints,
  } as ExtractAllCollectionCustomEndpoints<TCollections> &
    ExtractAllCollectionDefaultEndpoints<TCollections>
}
