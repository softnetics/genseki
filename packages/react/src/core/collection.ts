import type { ColumnDef } from '@tanstack/react-table'
import type { ConditionalExcept, Promisable, Simplify } from 'type-fest'
import type { UndefinedToOptional } from 'type-fest/source/internal'
import type { ZodObject, ZodOptional, ZodType } from 'zod/v4'

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
  type FieldsClient,
  type FieldShape,
  type FieldShapeBase,
} from './field'
import type { InferDataType } from './model'

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
    : TFieldShape extends FieldColumnShape<any>
      ? InferDataType<TFieldShape['$server']['column']['dataType']>
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
    : TFieldShape extends FieldColumnShape<any>
      ? InferDataType<TFieldShape['$server']['column']['dataType']>
      : never,
  TFieldShape
>

export type InferCreateFields<TFields extends Fields> = UndefinedToOptional<{
  -readonly [TShapeKey in keyof TFields['shape']]: InferCreateFieldShape<
    TFields['shape'][TShapeKey]
  >
}>

export type InferRelationField<
  TFieldShape extends FieldRelationShape<any>,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = TFieldShape['$server']['relation']['isList'] extends true
  ? InferCreateManyRelationFieldShape<TFieldShape, TKeys>
  : InferCreateOneRelationFieldShape<TFieldShape, TKeys>

export type InferField<TField extends FieldShapeBase> =
  TField extends FieldRelationShape<any>
    ? TField['$server']['relation']['isList'] extends true
      ? // TODO: Order field
        InferFields<TField['fields']>[]
      : InferFields<TField['fields']>
    : TField extends FieldColumnShape<any>
      ? InferDataType<TField['$server']['column']['dataType']>
      : never

export type InferFields<TFields extends Fields> = SimplifyConditionalExcept<
  {
    -readonly [TKey in keyof TFields['shape']]: TFields['shape'][TKey] extends FieldShapeBase
      ? InferField<TFields['shape'][TKey]>
      : never
  } & {
    __pk: string | number
    __id: string | number
  },
  never
>

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
      ? { data: InferFields<TFields>[]; total: number; page: number }
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

export interface CollectionCreateOptions<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> {
  fields: TFields
  api?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.CREATE>
}

export interface CollectionUpdateOptions<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> {
  fields: TFields
  updateApi?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.UPDATE>
  // TODO: This is not correct, it should return default value of form instead of just simple findOne response
  updateDefaultApi?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_ONE>
}

export interface CollectionListOptions<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> {
  fields: TFields
  columns: ColumnDef<InferFields<TFields>, any>[]
  api?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_MANY>
}

export interface CollectionOneOptions<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> {
  fields: TFields
  api?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_ONE>
}

export interface CollectionDeleteOptions<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> {
  fields: TFields
  api?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.DELETE>
}

export interface CollectionOptions<
  TContext extends AnyContextable = AnyContextable,
  TSlug extends string = string,
  TCreateFields extends Fields = Fields,
  TUpdateFields extends Fields = Fields,
  TListFields extends Fields = Fields,
  TOneFields extends Fields = Fields,
  TDeleteFields extends Fields = Fields,
  TApiRouter extends AnyApiRouter = AnyApiRouter,
> {
  slug: TSlug
  create?: CollectionCreateOptions<TContext, TCreateFields>
  update?: CollectionUpdateOptions<TContext, TUpdateFields>
  list?: CollectionListOptions<TContext, TListFields>
  one?: CollectionOneOptions<TContext, TOneFields>
  delete?: CollectionDeleteOptions<TContext, TDeleteFields>
  api?: TApiRouter
}

export interface CollectionOptionsClient {
  slug: string
  create?: {
    fields: FieldsClient
  }
  update?: {
    fields: FieldsClient
  }
  list?: {
    fields: FieldsClient
  }
  one?: {
    fields: FieldsClient
  }
}
