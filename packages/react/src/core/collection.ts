import type React from 'react'

import type { ColumnDef } from '@tanstack/react-table'
import type { ConditionalExcept, IsEmptyObject, Promisable, Simplify } from 'type-fest'
import type { UndefinedToOptional } from 'type-fest/source/internal'
import type { ZodObject, ZodOptional, ZodType } from 'zod'

import type { CollectionFindManyApiRoute } from './builder.utils'
import type { RenderArgs } from './config'
import type { AnyContextable, ContextToRequestContext } from './context'
import { type AnyApiRouter } from './endpoint'
import {
  type FieldColumnShape,
  type FieldRelationConnectOrCreateShape,
  type FieldRelationConnectShape,
  type FieldRelationCreateShape,
  type FieldRelationShape,
  type FieldRelationShapeBase,
  type Fields,
  type FieldShape,
  type FieldShapeBase,
  type FieldsOptions,
} from './field'
import type { DataType, InferDataType } from './model'

import type { ListViewContainerProps, SidebarProviderProps } from '../react'
import type {
  BaseViewProps,
  ClientBaseViewProps,
  ListActions,
} from '../react/views/collections/types'

export type ToZodObject<T extends Record<string, any>> = ZodObject<{
  [Key in keyof T]-?: T[Key] extends undefined
    ? ZodOptional<ZodType<NonNullable<T[Key]>>>
    : ZodType<T[Key]>
}>

type SimplifyConditionalExcept<Base, Condition> = Simplify<ConditionalExcept<Base, Condition>>

export const ApiDefaultMethod = {
  CREATE: 'create',
  FIND_ONE: 'findOne',
  FIND_MANY: 'findMany',
  UPDATE: 'update',
  DELETE: 'delete',
} as const
export type ApiDefaultMethod = (typeof ApiDefaultMethod)[keyof typeof ApiDefaultMethod]

export type ApplyFieldProperty<TType, TField extends FieldShapeBase> = TField['hidden'] extends true
  ? never
  : TField['required'] extends false
    ? TType | undefined
    : TType

export type InferUpdateOneRelationFieldShape<
  TFieldShape extends FieldRelationShapeBase,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = Simplify<
  ('create' extends TKeys
    ? {
        create: TFieldShape extends FieldRelationCreateShape | FieldRelationConnectOrCreateShape
          ? InferUpdateFields<TFieldShape['fields']>
          : never
      }
    : {}) &
    ('connect' extends TKeys
      ? {
          connect: InferDataType<TFieldShape['$server']['relation']['relationDataTypes'][0]>
        }
      : {}) &
    ('disconnect' extends TKeys
      ? {
          disconnect: InferDataType<TFieldShape['$server']['relation']['relationDataTypes'][0]>
        }
      : {})
>

export type InferUpdateManyRelationFieldShape<
  TField extends FieldRelationShapeBase,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = Partial<InferUpdateOneRelationFieldShape<TField, TKeys>>[]

export type InferUpdateRelationField<
  TField extends FieldRelationShapeBase,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = TField['$server']['relation']['isList'] extends true
  ? InferUpdateManyRelationFieldShape<TField, TKeys>
  : Partial<InferUpdateOneRelationFieldShape<TField, TKeys>>

export type InferUpdateFieldShape<TFieldShape extends FieldShape> = ApplyFieldProperty<
  TFieldShape extends FieldRelationShapeBase
    ? TFieldShape extends FieldRelationCreateShape
      ? Simplify<InferUpdateRelationField<TFieldShape, 'create' | 'connect' | 'disconnect'>>
      : TFieldShape extends FieldRelationConnectShape
        ? Simplify<InferUpdateRelationField<TFieldShape, 'connect' | 'disconnect'>>
        : TFieldShape extends FieldRelationConnectOrCreateShape
          ? Simplify<InferUpdateRelationField<TFieldShape, 'create' | 'connect' | 'disconnect'>>
          : never
    : TFieldShape extends FieldColumnShape
      ? TFieldShape['$server']['column']['isList'] extends true
        ? TFieldShape['$server']['column']['isRequired'] extends true
          ? InferDataType<TFieldShape['$server']['column']['dataType']>[]
          : InferDataType<TFieldShape['$server']['column']['dataType']>[] | undefined | null
        : TFieldShape['$server']['column']['isRequired'] extends true
          ? InferDataType<TFieldShape['$server']['column']['dataType']>
          : InferDataType<TFieldShape['$server']['column']['dataType']> | undefined | null
      : never,
  TFieldShape
>

export type InferUpdateFields<TFields extends Fields> = UndefinedToOptional<{
  -readonly [TKey in keyof TFields['shape']]: InferUpdateFieldShape<TFields['shape'][TKey]>
}>

export type InferCreateOneRelationFieldShape<
  TFieldShape extends FieldRelationShapeBase,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = Simplify<
  ('create' extends TKeys
    ? {
        create: TFieldShape extends FieldRelationCreateShape | FieldRelationConnectOrCreateShape
          ? InferCreateFields<TFieldShape['fields']>
          : never
      }
    : {}) &
    ('connect' extends TKeys
      ? {
          connect: InferDataType<TFieldShape['$server']['relation']['relationDataTypes'][0]>
        }
      : {}) &
    ('disconnect' extends TKeys
      ? {
          disconnect: InferDataType<TFieldShape['$server']['relation']['relationDataTypes'][0]>
        }
      : {})
>

export type InferCreateManyRelationFieldShape<
  TField extends FieldRelationShapeBase,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = Partial<InferCreateOneRelationFieldShape<TField, TKeys>>[]

export type InferCreateRelationField<
  TField extends FieldRelationShapeBase,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = TField['$server']['relation']['isList'] extends true
  ? InferCreateManyRelationFieldShape<TField, TKeys>
  : Partial<InferCreateOneRelationFieldShape<TField, TKeys>>

export type InferCreateFieldShape<TFieldShape extends FieldShape> = ApplyFieldProperty<
  TFieldShape extends FieldRelationShapeBase
    ? TFieldShape extends FieldRelationCreateShape
      ? Simplify<InferCreateRelationField<TFieldShape, 'create'>>
      : TFieldShape extends FieldRelationConnectShape
        ? Simplify<InferCreateRelationField<TFieldShape, 'connect'>>
        : TFieldShape extends FieldRelationConnectOrCreateShape
          ? Simplify<InferCreateRelationField<TFieldShape, 'create' | 'connect'>>
          : never
    : TFieldShape extends FieldColumnShape
      ? TFieldShape['$server']['column']['isList'] extends true
        ? TFieldShape['$server']['column']['isRequired'] extends true
          ? InferDataType<TFieldShape['$server']['column']['dataType']>[]
          : InferDataType<TFieldShape['$server']['column']['dataType']>[] | undefined | null
        : TFieldShape['$server']['column']['isRequired'] extends true
          ? InferDataType<TFieldShape['$server']['column']['dataType']>
          : InferDataType<TFieldShape['$server']['column']['dataType']> | undefined | null
      : never,
  TFieldShape
>

export type InferCreateFields<TFields extends Fields> = UndefinedToOptional<{
  -readonly [TShapeKey in keyof TFields['shape']]: InferCreateFieldShape<
    TFields['shape'][TShapeKey]
  >
}>

export type InferRelationField<
  TFieldShape extends FieldRelationShape,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = TFieldShape['$server']['relation']['isList'] extends true
  ? InferCreateManyRelationFieldShape<TFieldShape, TKeys>
  : InferCreateOneRelationFieldShape<TFieldShape, TKeys>

export type InferField<TField extends FieldShapeBase> = TField extends FieldRelationShape
  ? TField['$server']['relation']['isList'] extends true
    ? // TODO: Order field
      TField['$server']['relation']['isRequired'] extends true
      ? _InferFields<TField['fields']>[]
      : _InferFields<TField['fields']>[] | undefined | null
    : TField['$server']['relation']['isRequired'] extends true
      ? _InferFields<TField['fields']>
      : _InferFields<TField['fields']> | undefined | null
  : TField extends FieldColumnShape
    ? TField['$server']['column']['isList'] extends true
      ? TField['$server']['column']['isRequired'] extends true
        ? InferDataType<TField['$server']['column']['dataType']>[]
        : InferDataType<TField['$server']['column']['dataType']>[] | undefined | null
      : TField['$server']['column']['isRequired'] extends true
        ? InferDataType<TField['$server']['column']['dataType']>
        : InferDataType<TField['$server']['column']['dataType']> | undefined | null
    : never

type _InferFields<TFields extends Fields> = SimplifyConditionalExcept<
  {
    -readonly [TKey in keyof TFields['shape']]: TFields['shape'][TKey] extends FieldShapeBase
      ? InferField<TFields['shape'][TKey]>
      : never
  } & BaseData,
  never
>

export type InferFields<TFields extends Fields> = UndefinedToOptional<_InferFields<TFields>>

export interface ServerApiHandlerArgs<TContext extends AnyContextable, TFields extends Fields> {
  slug: string
  fields: TFields
  context: ContextToRequestContext<TContext>
}

export type ApiArgs<
  TContext extends AnyContextable,
  TMethod extends ApiDefaultMethod,
  TFields extends Fields,
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
  TFields extends Fields,
> = TMethod extends typeof ApiDefaultMethod.CREATE
  ? { __pk: string | number; __id: string | number }
  : TMethod extends typeof ApiDefaultMethod.FIND_ONE
    ? InferFields<TFields>
    : TMethod extends typeof ApiDefaultMethod.FIND_MANY
      ? { data: InferFields<TFields>[]; total: number; totalPage: number; currentPage: number }
      : TMethod extends typeof ApiDefaultMethod.UPDATE
        ? { __pk: string | number; __id: string | number }
        : TMethod extends typeof ApiDefaultMethod.DELETE
          ? { success: boolean }
          : never

export type ApiFindOneArgs = {
  // This should be the primary field of the collection e.g. __pk or username
  id: string | number
}

export type ApiFindManyArgs = {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type ApiCreateArgs<TFields extends Fields> = {
  data: InferCreateFields<TFields>
}

export type ApiHandlerFn<
  TContext extends AnyContextable,
  TFields extends Fields,
  TMethod extends ApiDefaultMethod,
> = (args: ApiArgs<TContext, TMethod, TFields>) => Promisable<ApiReturnType<TMethod, TFields>>

export type ApiUpdateArgs<TFields extends Fields> = {
  // This should be the primary field of the collection e.g. __pk or username
  id: string | number
  data: InferUpdateFields<TFields>
}

export type ApiDeleteArgs = {
  ids: string[] | number[]
}

export type ApiConfigHandlerFn<
  TContext extends AnyContextable,
  TFields extends Fields,
  TMethod extends ApiDefaultMethod,
> = (
  args: ApiArgs<TContext, TMethod, TFields> & {
    defaultApi: ApiHandlerFn<TContext, TFields, TMethod>
  }
) => Promisable<ApiReturnType<TMethod, TFields>>

export type CollectionFieldsOptions<TContext extends AnyContextable, TFields extends Fields> =
  FieldsOptions<TContext, TFields> extends infer TOptions
    ? IsEmptyObject<TOptions> extends true
      ? {}
      : { options: Simplify<TOptions> }
    : {}

export type CollectionCreateConfig<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> = {
  fields: TFields
  api?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.CREATE>
} & CollectionFieldsOptions<TContext, TFields>

export type CollectionUpdateConfig<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> = {
  fields: TFields
  updateApi?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.UPDATE>
  // TODO: This is not correct, it should return default value of form instead of just simple findOne response
  updateDefaultApi?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_ONE>
} & CollectionFieldsOptions<TContext, TFields>

// Extract searchable columns from fields
export type ExtractSearchableColumns<TFields extends Fields> = {
  [K in keyof TFields['shape']]: TFields['shape'][K] extends FieldColumnShape
    ? TFields['shape'][K]['$client']['column']['dataType'] extends typeof DataType.STRING
      ? K
      : never
    : never
}[keyof TFields['shape']]

// Extract sortable columns from fields
export type ExtractSortableColumns<TFields extends Fields> = {
  [K in keyof TFields['shape']]: TFields['shape'][K] extends FieldColumnShape
    ? TFields['shape'][K]['$client']['column']['dataType'] extends
        | typeof DataType.STRING
        | typeof DataType.INT
        | typeof DataType.FLOAT
        | typeof DataType.DATETIME
        | typeof DataType.BIGINT
        | typeof DataType.DECIMAL
      ? K
      : never
    : never
}[keyof TFields['shape']]

export interface ListConfiguration<TFields extends Fields> {
  search?: ExtractSearchableColumns<TFields>[]
  sortBy?: ExtractSortableColumns<TFields>[]
}

export interface BaseData {
  __id: string | number
  __pk: string | number
}

export type CollectionListResponse = {
  data: ({} & BaseData)[]
  total: number
  totalPage: number
  currentPage: number
}

interface CustomCollectionLayout {
  (args: {
    CollectionLayout: React.FC<{ children: React.ReactNode }>
    CollectionSidebar: React.FC
    SidebarProvider: React.FC<SidebarProviderProps>
    SidebarInset: React.FC<React.ComponentProps<'main'>>
    TopbarNav: React.FC
    listViewProps: CollectionListViewProps
    children: React.ReactNode
  }): React.ReactElement
}

interface CustomCollectionPage<TFields extends Fields> {
  (args: {
    listViewProps: CollectionListViewProps<TFields>
    ListViewContainer: React.FC<ListViewContainerProps>
    ListView: React.FC
    Banner: React.FC
  }): React.ReactElement
}
interface CustomCollectionUI<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> {
  layout?: CustomCollectionLayout
  pages?: CustomCollectionPage<TFields>
}

export type CollectionListConfig<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
  TFieldsData = any,
> = {
  fields: TFields
  columns: ColumnDef<TFieldsData, any>[]
  api?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_MANY>
  uis?: CustomCollectionUI<TContext, TFields>
  configuration?: ListConfiguration<TFields>
  /**
   * @param actions will decide whether or not to show actios in `list` view screen, This is not related to available features of collection, but rather only visible UI part of the `list` page
   */
  actions?: {
    create?: boolean
    update?: boolean
    delete?: boolean
    one?: boolean
  }
} & CollectionFieldsOptions<TContext, TFields>

export type CollectionOneConfig<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> = {
  fields: TFields
  api?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_ONE>
} & CollectionFieldsOptions<TContext, TFields>

export type CollectionDeleteConfig<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> = {
  fields: TFields
  api?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.DELETE>
} & CollectionFieldsOptions<TContext, TFields>

export interface CollectionConfig<
  TContext extends AnyContextable,
  TSlug extends string,
  TCreateFields extends Fields,
  TUpdateFields extends Fields,
  TListFields extends Fields,
  TOneFields extends Fields,
  TDeleteFields extends Fields,
  TApiRouter extends AnyApiRouter,
> {
  slug: TSlug
  create?: CollectionCreateConfig<TContext, TCreateFields>
  update?: CollectionUpdateConfig<TContext, TUpdateFields>
  list?: CollectionListConfig<TContext, TListFields>
  one?: CollectionOneConfig<TContext, TOneFields>
  delete?: CollectionDeleteConfig<TContext, TDeleteFields>
  api?: TApiRouter
}

export interface CollectionConfigClient {
  slug: string
  create?: {
    fields: Fields
  }
  update?: {
    fields: Fields
  }
  list?: {
    fields: Fields
  }
  one?: {
    fields: Fields
  }
}

export interface CollectionListViewProps<TFields extends Fields = Fields>
  extends BaseViewProps,
    RenderArgs {
  headers: Headers
  searchParams: Record<string, string | string[]>
  columns: ColumnDef<any>[]
  findMany: CollectionFindManyApiRoute<string, TFields>
  listConfiguration?: ListConfiguration<TFields>
  actions?: ListActions
}

export interface ClientCollectionListViewProps<TFields extends Fields>
  extends ClientBaseViewProps,
    RenderArgs {
  headers: Headers
  searchParams: Record<string, string | string[]>
  columns: ColumnDef<any>[]
  listConfiguration?: ListConfiguration<TFields>
  actions?: ListActions
}
