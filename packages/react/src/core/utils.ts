import { generateJSON } from '@tiptap/html'
import * as R from 'remeda'
import type { Except, IsNever, Simplify } from 'type-fest'
import type { ZodObject, ZodOptional, ZodType } from 'zod/v4'

import type {
  FieldColumnJsonRichTextShape,
  FieldColumnStringMediaShape,
  FieldRelationShape,
  Fields,
  FieldsClientShape,
  FieldShapeBase,
  FieldsShape,
} from './field'
import type { StorageAdapterClient } from './file-storage-adapters'
import { constructSanitizedExtensions } from './richtext'

export function tryParseJSONObject(jsonString: string): Record<string, unknown> | false {
  try {
    const o = JSON.parse(jsonString)

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === 'object') {
      return o
    }
  } catch (error) {
    return false
  }
  return false
}

// TODO: Move this to ./field.ts
export function isRelationFieldShape(fieldShape: FieldShapeBase): fieldShape is FieldRelationShape {
  return fieldShape.$client.source === 'relation'
}

export function isRichTextFieldShape(
  fieldShape: FieldShapeBase
): fieldShape is FieldColumnJsonRichTextShape {
  return fieldShape.type === 'richText'
}

export function isMediaFieldShape(
  fieldShape: FieldShapeBase
): fieldShape is FieldColumnStringMediaShape {
  return fieldShape.type === 'media'
}

export type ConditionNeverKey<T extends Record<string, unknown>> = {
  [K in keyof T]: IsNever<T[K]> extends true ? K : never
}[keyof T]

export type ConditionalExceptNever<T extends Record<string, unknown>> = Except<
  T,
  ConditionNeverKey<T>
>

export type ToZodObject<T extends Record<string, any>> = ZodObject<{
  [Key in keyof T]-?: T[Key] extends undefined
    ? ZodOptional<ZodType<NonNullable<T[Key]>>>
    : ZodType<T[Key]>
}>

export function appendFieldNameToFields<TFieldsShape extends FieldsShape>(
  fieldsShape: TFieldsShape
): Simplify<TFieldsShape> {
  return Object.fromEntries(
    Object.entries(fieldsShape).map(([key, field]) => {
      field.$client.fieldName = key
      field.$server.fieldName = key
      return [key, field]
    })
  ) as TFieldsShape
}

export function mapValueToTsValue(fields: Fields, value: Record<string, any>): Record<string, any> {
  const mappedEntries = Object.entries(fields).flatMap(([fieldName, field]) => {
    if (value[fieldName] === undefined) return []
    if (field.$client.source !== 'column') return []
    return [[field.$client.column.name, value[fieldName]]]
  })

  return Object.fromEntries(mappedEntries.filter((r) => r.length > 0))
}

export type JoinArrays<T extends any[]> = Simplify<
  T extends [infer A]
    ? IsNever<A> extends true
      ? {}
      : A
    : T extends [infer A, ...infer B]
      ? IsNever<A> extends true
        ? JoinArrays<B>
        : A & JoinArrays<B>
      : T extends []
        ? {}
        : never
>

/**
 * @description Return the default values for each provided fields, This should be used with `create` form
 */
export const getDefaultValueFromFields = (
  fieldsShape: FieldsClientShape,
  storageAdapter?: StorageAdapterClient
) => {
  const mappedCheck = Object.fromEntries(
    Object.entries(
      R.mapValues(fieldsShape, (field) => {
        if (isRichTextFieldShape(field)) {
          const content = field.editor.content ?? field.default ?? ''

          // TODO: Support JSONContent and JSONContent[]
          if (typeof content !== 'string') return undefined

          const json = tryParseJSONObject(content)

          return (
            json ||
            generateJSON(
              content,
              // TODO: Recheck this type
              constructSanitizedExtensions((field.editor.extensions as any[]) || [], storageAdapter)
            )
          )
        }
        return 'default' in field ? field.default : undefined
      })
    ).filter(([fieldName, defaultValue]) => typeof defaultValue !== 'undefined')
  )

  return mappedCheck
}

export const mimeTypeValidate = (allowedMimes: string[], checkingMime: string) => {
  for (const allowedMime of allowedMimes) {
    const [allowedMimeType, allowedMimeSubType] = allowedMime.split('/')
    const [checkingMimeType, checkingMimeSubType] = checkingMime.split('/')

    if (allowedMimeSubType === '*' && checkingMimeType === allowedMimeType) return true

    if (checkingMime === allowedMime) return true
  }

  return false
}
