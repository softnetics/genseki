import {
  ExtractObjectValues,
  ExtractTablesWithRelations,
  Many,
  Simplify,
  Table,
  TableRelationalConfig,
} from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { MinimalContext } from './config'
import { ApiRouter, ClientApiRouter } from './endpoint'
import { BaseField, Field, FieldMetadataColumns, FieldMetadataRelations } from './field'

export const ApiDefaultMethod = {
  CREATE: 'create',
  FIND_ONE: 'findOne',
  FIND_MANY: 'findMany',
  UPDATE: 'update',
  DELETE: 'delete',
} as const
export type ApiDefaultMethod = (typeof ApiDefaultMethod)[keyof typeof ApiDefaultMethod]

type GetTableRelationConfigFromTableName<
  TTableRelationConfig extends Record<string, TableRelationalConfig>,
  TTableName extends string,
> = Simplify<
  ExtractObjectValues<{
    [TKey in keyof TTableRelationConfig]: TTableRelationConfig[TKey] extends TableRelationalConfig
      ? TTableRelationConfig[TKey]['dbName'] extends TTableName
        ? TTableRelationConfig[TKey]
        : never
      : never
  }>
>

export type MaybePromise<T> = T | Promise<T>

export type InferField<TField extends BaseField> = TField['_'] extends FieldMetadataRelations
  ? TField['_']['$relation'] extends Many<any>
    ? Array<TField['_']['$primaryColumn']['_']['data']>
    : TField['_']['$primaryColumn']['_']['data']
  : TField['_'] extends FieldMetadataColumns
    ? TField['_']['$column']['_']['data']
    : never

export type InferFields<TFields extends Record<string, BaseField>> = Simplify<{
  [TKey in keyof TFields]: TFields[TKey] extends BaseField ? InferField<TFields[TKey]> : never
}>

export type ServerApiHandlerArgs<
  TContext extends MinimalContext = MinimalContext,
  TFields extends Record<string, BaseField> = Record<string, BaseField>,
> = {
  slug: string
  fields: TFields
  context: TContext
}

export type ApiArgs<
  TMethod extends ApiDefaultMethod,
  TContext extends MinimalContext,
  TFields extends Record<string, BaseField>,
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
  TFields extends Record<string, BaseField>,
> = TMethod extends typeof ApiDefaultMethod.CREATE
  ? { id: string | number }
  : TMethod extends typeof ApiDefaultMethod.FIND_ONE
    ? InferFields<TFields>
    : TMethod extends typeof ApiDefaultMethod.FIND_MANY
      ? { data: InferFields<TFields>[]; total: number; page: number }
      : TMethod extends typeof ApiDefaultMethod.UPDATE
        ? { id: string | number }
        : TMethod extends typeof ApiDefaultMethod.DELETE
          ? void
          : never

export type CollectionApiDefaultMethod<TCollection extends Collection> = Extract<
  keyof TCollection['admin']['api'],
  string
>

export type ApiFindOneArgs = {
  id: string | number
}

export type ApiFindOneHandler<
  TContext extends MinimalContext,
  TFields extends Record<string, BaseField>,
> = (
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
  TFields extends Record<string, BaseField>,
> = (
  args: ApiArgs<typeof ApiDefaultMethod.FIND_MANY, TContext, TFields>
) => MaybePromise<ApiReturnType<typeof ApiDefaultMethod.FIND_MANY, TFields>>

export type ApiCreateArgs<TFields extends Record<string, BaseField>> = {
  data: InferFields<TFields>
}

export type ApiCreateHandler<
  TContext extends MinimalContext,
  TFields extends Record<string, BaseField>,
> = (
  args: ApiArgs<typeof ApiDefaultMethod.CREATE, TContext, TFields>
) => MaybePromise<ApiReturnType<typeof ApiDefaultMethod.CREATE, TFields>>

export type ApiUpdateArgs<TFields extends Record<string, BaseField>> = {
  id: string | number
  data: InferFields<TFields>
}

export type ApiUpdateHandler<
  TContext extends MinimalContext,
  TFields extends Record<string, BaseField>,
> = (
  args: ApiArgs<typeof ApiDefaultMethod.UPDATE, TContext, TFields>
) => MaybePromise<ApiReturnType<typeof ApiDefaultMethod.UPDATE, TFields>>

export type ApiDeleteArgs = {
  ids: string[] | number[]
}

export type ApiDeleteHandler<
  TContext extends MinimalContext,
  TFields extends Record<string, BaseField>,
> = (
  args: ApiArgs<typeof ApiDefaultMethod.DELETE, TContext, TFields>
) => MaybePromise<ApiReturnType<typeof ApiDefaultMethod.DELETE, TFields>>

export type ClientApiArgs<
  TMethod extends ApiDefaultMethod,
  TFields extends Record<string, BaseField>,
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
  TFields extends Record<string, Field<TContext>> = Record<string, Field<TContext>>,
> = {
  create?: ApiCreateHandler<TContext, TFields>
  findOne?: ApiFindOneHandler<TContext, TFields>
  findMany?: ApiFindManyHandler<TContext, TFields>
  update?: ApiUpdateHandler<TContext, TFields>
  delete?: ApiDeleteHandler<TContext, TFields>
}

export type CollectionAdminApi<
  TContext extends MinimalContext = MinimalContext,
  TFields extends Record<string, Field<TContext>> = Record<string, Field<TContext>>,
> = {
  create: ApiCreateHandler<TContext, TFields>
  findOne: ApiFindOneHandler<TContext, TFields>
  findMany: ApiFindManyHandler<TContext, TFields>
  update: ApiUpdateHandler<TContext, TFields>
  delete: ApiDeleteHandler<TContext, TFields>
}

export type CollectionAdminConfig<
  TContext extends MinimalContext = MinimalContext,
  TFields extends Record<string, Field<TContext>> = Record<string, Field<TContext>>,
  TApiRouter extends ApiRouter = ApiRouter,
> = {
  api?: CollectionAdminApiConfig<TContext, TFields>
  endpoints?: TApiRouter
}

export type CollectionAdmin<
  TContext extends MinimalContext = MinimalContext,
  TFields extends Record<string, Field<TContext>> = Record<string, Field<TContext>>,
  TApiRouter extends ApiRouter = ApiRouter,
> = {
  api: CollectionAdminApi<TContext, TFields>
  endpoints?: TApiRouter
}

export type CollectionConfig<
  TSlug extends string = string,
  TContext extends MinimalContext = MinimalContext,
  TFields extends Record<string, Field<TContext>> = any,
  TAppRouter extends ApiRouter = any,
> = {
  slug: TSlug
  primaryField: Extract<keyof TFields, string>
  fields: TFields
  admin?: CollectionAdminConfig<TContext, TFields, TAppRouter>
}

export type Collection<
  TSlug extends string = any,
  TTableName extends string = any,
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends MinimalContext = MinimalContext,
  TFields extends Record<string, Field<TContext>> = any,
  TApiRouter extends ApiRouter = any,
> = {
  _: {
    $table: FindTableByTableName<TFullSchema, TTableName>
    $tableConfig: GetTableRelationConfigFromTableName<
      ExtractTablesWithRelations<TFullSchema>,
      TTableName
    >
  }
  slug: TSlug
  primaryField: Extract<keyof TFields, string>
  fields: TFields
  admin: CollectionAdmin<TContext, TFields, TApiRouter>
}

export type ToClientCollection<TCollection extends Collection> = ClientCollection<
  InferSlugFromCollection<TCollection>,
  InferTableNameFromCollection<TCollection>,
  InferFullSchemaFromCollection<TCollection>,
  InferContextFromCollection<TCollection>,
  InferFieldsFromCollection<TCollection>,
  InferApiRouterFromCollection<TCollection>
>

export type ToClientCollectionList<TCollections extends Collection[]> = TCollections extends [
  infer TCollection,
  ...infer TCollectionsRest,
]
  ? [
      ToClientCollection<TCollection extends Collection ? TCollection : never>,
      ...ToClientCollectionList<TCollectionsRest extends Collection[] ? TCollectionsRest : never>,
    ]
  : []

// TODO: proper omit
export type ClientCollection<
  TSlug extends string = string,
  TTableName extends string = any,
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends MinimalContext = any,
  TFields extends Record<string, BaseField> = Record<string, BaseField>,
  TEndpoints extends ClientApiRouter = {},
> = Simplify<
  Omit<Collection<TSlug, TTableName, TFullSchema, TContext, any>, 'fields'> & {
    fields: TFields
    _: {
      $endpoints: TEndpoints
    }
  }
>

export type InferSlugFromCollection<TCollection extends Collection> = TCollection['slug']

export type InferTableNameFromCollection<TCollection extends Collection> =
  TCollection extends Collection<any, infer TTableName> ? TTableName : never

export type InferFullSchemaFromCollection<TCollection extends Collection> =
  TCollection extends Collection<any, any, infer TFullSchema> ? TFullSchema : never

export type InferContextFromCollection<TCollection extends Collection> =
  TCollection extends Collection<any, any, any, infer TContext> ? TContext : never

export type InferFieldsFromCollection<TCollection extends Collection> =
  TCollection extends Collection<any, any, any, any, infer TFields> ? TFields : never

export type InferApiRouterFromCollection<TCollection extends Collection> =
  TCollection extends Collection<any, any, any, any, any, infer TApiRouter> ? TApiRouter : never

export type GetCollectionApiRouter<TCollection extends Collection> = TCollection extends Collection
  ? TCollection['admin'] extends CollectionAdminConfig
    ? TCollection['admin']['api'] extends ApiRouter
      ? TCollection['admin']['api']
      : never
    : never
  : never

export type FindTableByTableKey<
  TFullSchema extends Record<string, unknown>,
  TTableKey extends keyof TFullSchema,
> = TFullSchema[TTableKey] extends Table<any> ? TFullSchema[TTableKey] : never

export type FindTableByTableName<
  TFullSchema extends Record<string, unknown>,
  TTableName extends string,
> = {
  [TKey in keyof TFullSchema]: TFullSchema[TKey] extends Table<infer TConfig>
    ? TConfig['name'] extends TTableName
      ? TFullSchema[TKey]
      : never
    : never
}[keyof TFullSchema]

export type GetAllTableKeys<TFullSchema extends Record<string, unknown>> = Extract<
  {
    [TKey in keyof TFullSchema]: TFullSchema[TKey] extends Table<any> ? TKey : never
  }[keyof TFullSchema],
  string
>

export type GetSchema<TDatabase extends NodePgDatabase<any>> =
  TDatabase extends NodePgDatabase<infer TFullSchema> ? TFullSchema : never

type ExtractCollectionAdminApi<TCollection extends Collection> =
  TCollection['admin'] extends undefined
    ? undefined
    : TCollection['admin'] extends CollectionAdminConfig
      ? TCollection['admin']['api']
      : TCollection['admin']

type ApiDefaultHandlerReturnType<
  TCollection extends Collection,
  TMethod extends Extract<keyof CollectionAdminApiConfig, string>,
> =
  TCollection extends Collection<any, any, any, infer TContext, infer TFields>
    ? TMethod extends ApiDefaultMethod
      ? ReturnType<Exclude<CollectionAdminApiConfig<TContext, TFields>[TMethod], undefined>>
      : never
    : never

export type ApiHandlerReturnType<
  TCollection extends Collection,
  TMethod extends Extract<keyof CollectionAdminApiConfig, string>,
> = TCollection['admin'] extends undefined
  ? ApiDefaultHandlerReturnType<TCollection, TMethod>
  : ExtractCollectionAdminApi<TCollection> extends CollectionAdminApiConfig
    ? ExtractCollectionAdminApi<TCollection>[TMethod] extends (...args: any) => any
      ? ReturnType<ExtractCollectionAdminApi<TCollection>[TMethod]>
      : ApiDefaultHandlerReturnType<TCollection, TMethod>
    : ApiDefaultHandlerReturnType<TCollection, TMethod>

type ApiDefaultHandlerParameters<
  TCollection extends Collection,
  TMethod extends Extract<keyof CollectionAdminApiConfig, string>,
> =
  TCollection extends Collection<any, any, any, any, infer TFields>
    ? ClientApiArgs<TMethod, TFields>
    : never

export type ClientApiHandlerParameters<
  TCollection extends Collection,
  TMethod extends Extract<keyof CollectionAdminApiConfig, string>,
> = Simplify<
  TCollection['admin'] extends undefined
    ? ApiDefaultHandlerParameters<TCollection, TMethod>
    : ExtractCollectionAdminApi<TCollection> extends CollectionAdminApiConfig
      ? ExtractCollectionAdminApi<TCollection>[TMethod] extends (...args: any) => any
        ? ClientApiArgs<TMethod, TCollection['fields']>
        : ApiDefaultHandlerParameters<TCollection, TMethod>
      : ApiDefaultHandlerParameters<TCollection, TMethod>
>

export type GetCollectionMethod<TCollection extends Collection> = Extract<
  keyof TCollection['admin']['api'],
  string
>
