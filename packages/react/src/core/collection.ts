import type { ColumnDef } from '@tanstack/react-table'
import type { ConditionalExcept, Simplify } from 'type-fest'
import type { ZodObject, ZodOptional, ZodType } from 'zod/v4'

import type { AnyContextable, ContextToRequestContext } from './context'
import { type AnyApiRouter } from './endpoint'
import {
  type FieldColumnShape,
  type FieldOptionsShapeBase,
  type FieldRelationConnectOrCreateShape,
  type FieldRelationConnectShape,
  type FieldRelationCreateShape,
  type FieldRelationShape,
  type FieldRelationShapeBase,
  type Fields,
  type FieldsClient,
  type FieldShape,
  type FieldShapeClient,
  type FieldsShape,
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

export type MaybePromise<T> = T | Promise<T>

export type ActivateFieldMutateMode<
  TType,
  TField extends FieldOptionsShapeBase,
> = TField['hidden'] extends true ? never : TType

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
export type InferOneRelationMutationFieldShape<TFieldShape extends FieldRelationShapeBase> = {
  create?: TFieldShape extends FieldRelationCreateShape | FieldRelationConnectOrCreateShape
    ? InferCreateFieldsShape<TFieldShape['fields']['shape']>
    : never
  // TODO: Only Support single forign key relation
  connect?: InferDataType<TFieldShape['$server']['relation']['relationDataTypes'][0]>
  // TODO: Only Support single forign key relation
  disconnect?: InferDataType<TFieldShape['$server']['relation']['relationDataTypes'][0]>
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
export type InferManyRelationMutationFieldShape<TField extends FieldRelationShapeBase> = Array<
  InferOneRelationMutationFieldShape<TField>
>

type PickFromArrayOrObject<TArrayOrObject, TKeys extends string> =
  TArrayOrObject extends Array<any>
    ? Array<Pick<TArrayOrObject[number], TKeys>>
    : TArrayOrObject extends Record<string, any>
      ? Pick<TArrayOrObject, TKeys>
      : never

export type InferMutationRelationField<TField extends FieldRelationShapeBase> =
  TField['$server']['relation']['isList'] extends true
    ? Simplify<InferManyRelationMutationFieldShape<TField>>
    : Simplify<InferOneRelationMutationFieldShape<TField>>

export type InferUpdateFieldShape<TFieldShape extends FieldShape> =
  TFieldShape extends FieldRelationShapeBase
    ? TFieldShape extends FieldRelationCreateShape
      ? Simplify<
          PickFromArrayOrObject<InferMutationRelationField<TFieldShape>, 'create' | 'disconnect'>
        >
      : TFieldShape extends FieldRelationConnectShape
        ? Simplify<
            PickFromArrayOrObject<InferMutationRelationField<TFieldShape>, 'connect' | 'disconnect'>
          >
        : TFieldShape extends FieldRelationConnectOrCreateShape
          ? Simplify<InferMutationRelationField<TFieldShape>>
          : never
    : TFieldShape extends FieldColumnShape<any>
      ? ActivateFieldMutateMode<
          InferDataType<TFieldShape['$server']['column']['dataType']>,
          TFieldShape
        >
      : never

export type InferUpdateFieldsShape<TFieldsShape extends FieldsShape> = SimplifyConditionalExcept<
  {
    [TKey in keyof TFieldsShape]: TFieldsShape[TKey] extends FieldShape
      ? Simplify<InferUpdateFieldShape<TFieldsShape[TKey]>>
      : never
  },
  never
>

export type InferCreateFieldShape<TFieldShape extends FieldShape> =
  TFieldShape extends FieldRelationShapeBase
    ? TFieldShape extends FieldRelationCreateShape
      ? Simplify<PickFromArrayOrObject<InferMutationRelationField<TFieldShape>, 'create'>>
      : TFieldShape extends FieldRelationConnectShape
        ? Simplify<PickFromArrayOrObject<InferMutationRelationField<TFieldShape>, 'connect'>>
        : TFieldShape extends FieldRelationConnectOrCreateShape
          ? Simplify<
              PickFromArrayOrObject<InferMutationRelationField<TFieldShape>, 'create' | 'connect'>
            >
          : never
    : TFieldShape extends FieldColumnShape<any>
      ? ActivateFieldMutateMode<
          InferDataType<TFieldShape['$server']['column']['dataType']>,
          TFieldShape
        >
      : never

export type InferCreateFieldsShape<TFieldsShape extends FieldsShape> = SimplifyConditionalExcept<
  {
    [TShapeKey in keyof TFieldsShape]: TFieldsShape[TShapeKey] extends FieldShape
      ? InferCreateFieldShape<TFieldsShape[TShapeKey]>
      : never
  },
  never
>

export type InferRelationField<TFieldShape extends FieldRelationShape<any>> =
  TFieldShape['$server']['relation']['isList'] extends true
    ? InferManyRelationMutationFieldShape<TFieldShape>
    : InferOneRelationMutationFieldShape<TFieldShape>

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
export type InferField<TField extends FieldShapeClient> =
  TField extends FieldRelationShape<any>
    ? TField['$server']['relation']['isList'] extends true
      ? // TODO: Order field
        Array<Simplify<InferFields<TField['fields']>>>
      : Simplify<InferFields<TField['fields']>>
    : TField extends FieldColumnShape<any>
      ? InferDataType<TField['$server']['column']['dataType']>
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
    [TKey in keyof TFields['shape']]: TFields['shape'][TKey] extends FieldShapeClient
      ? TFields['shape'][TKey] extends FieldColumnShape<any>
        ? Simplify<InferField<TFields['shape'][TKey]>>
        : // NOTE: This is to remove the __id field from the relation fields
          Simplify<Omit<InferField<TFields['shape'][TKey]>, '__id'>>
      : never
  } & {
    readonly __pk: string | number
    readonly __id: string | number
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
  data: InferCreateFieldsShape<TFields['shape']>
}

export type ApiHandlerFn<
  TContext extends AnyContextable,
  TFields extends Fields,
  TMethod extends ApiDefaultMethod,
> = (args: ApiArgs<TContext, TMethod, TFields>) => MaybePromise<ApiReturnType<TMethod, TFields>>

export type ApiUpdateArgs<TFields extends Fields> = {
  // This should be the primary field of the collection e.g. __pk or username
  id: string | number
  data: InferUpdateFieldsShape<TFields['shape']>
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
) => MaybePromise<ApiReturnType<TMethod, TFields>>

export interface CollectionCreateOptions<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> {
  identifierColumn: string
  fields: TFields
  api?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.CREATE>
}

export interface CollectionUpdateOptions<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> {
  identifierColumn: string
  fields: TFields
  updateApi?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.UPDATE>
  // TODO: This is not correct, it should return default value of form instead of just simple findOne response
  updateDefaultApi?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_ONE>
}

export interface CollectionListOptions<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> {
  identifierColumn: string
  fields: TFields
  columns: ColumnDef<InferFields<TFields>, any>[]
  api?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_MANY>
}

export interface CollectionOneOptions<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> {
  identifierColumn: string
  fields: TFields
  api?: ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_ONE>
}

export interface CollectionDeleteOptions<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> {
  identifierColumn: string
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
    identifierColumn: string
    fields: FieldsClient
  }
  update?: {
    identifierColumn: string
    fields: FieldsClient
  }
  list?: {
    identifierColumn: string
    fields: FieldsClient
  }
  one?: {
    identifierColumn: string
    fields: FieldsClient
  }
}
