import { generateJSON } from '@tiptap/html'
import type { Column, SQL, TableRelationalConfig } from 'drizzle-orm'
import { is, sql, Table } from 'drizzle-orm'
import * as R from 'remeda'
import type { Except, IsNever, Simplify, ValueOf } from 'type-fest'
import type { ZodObject, ZodOptional, ZodType } from 'zod/v4'

import type { FieldBase } from '.'
import type {
  FieldClientBase,
  FieldColumnJsonRichText,
  FieldColumnStringMedia,
  FieldRelation,
  Fields,
  FieldsClient,
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

export function isRelationField(field: FieldBase): field is FieldRelation {
  return field.$client.source === 'relation'
}

export function isRichTextField(field: FieldClientBase): field is FieldColumnJsonRichText {
  return field.type === 'richText'
}

export function isMediaField(field: FieldBase): field is FieldColumnStringMedia {
  return field.type === 'media'
}

export type ConditionNeverKey<T extends Record<string, unknown>> = {
  [K in keyof T]: IsNever<T[K]> extends true ? K : never
}[keyof T]

export type ConditionalExceptNever<T extends Record<string, unknown>> = Except<
  T,
  ConditionNeverKey<T>
>

export type GetPrimaryColumn<TTableRelationalConfig extends TableRelationalConfig> = ValueOf<{
  [K in keyof TTableRelationalConfig['columns']]: TTableRelationalConfig['columns'][K]['_']['isPrimaryKey'] extends true
    ? TTableRelationalConfig['columns'][K]
    : never
}>

export type GetPrimaryColumnTsName<TTableRelationalConfig extends TableRelationalConfig> = ValueOf<{
  [K in keyof TTableRelationalConfig['columns']]: TTableRelationalConfig['columns'][K]['_']['isPrimaryKey'] extends true
    ? K
    : never
}>

export function getPrimaryColumn<TTableConfig extends TableRelationalConfig>(
  tableConfig: TTableConfig
): GetPrimaryColumn<TTableConfig> {
  const primaryColumnEntry = Object.entries(tableConfig.columns).find(([_, column]) => {
    return column.primary === true
  })

  if (primaryColumnEntry === undefined) {
    throw new Error(
      'Can not find primary key column. Please make sure to set the primary key in the table config.'
    )
  }

  return primaryColumnEntry[1] as GetPrimaryColumn<TTableConfig>
}

export function getPrimaryColumnTsName<TTableConfig extends TableRelationalConfig>(
  tableConfig: TableRelationalConfig
): GetPrimaryColumnTsName<TTableConfig> {
  const primaryColumnEntry = Object.entries(tableConfig.columns).find(([_, column]) => {
    return column.primary === true
  })

  if (primaryColumnEntry === undefined) {
    throw new Error(
      'Can not find primary key column. Please make sure to set the primary key in the table config.'
    )
  }

  return primaryColumnEntry[0] as GetPrimaryColumnTsName<TTableConfig>
}

export function getColumnTsName(columns: Record<string, Column>, column: Column) {
  const field = Object.entries(columns).find(([_, col]) => {
    return col.name === column.name
  })
  if (!field) throw new Error(`Column ${column.name} not found`)
  return field[0]
}

export function getTableFromSchema(schema: Record<string, unknown>, tableTsName: string): Table {
  if (!is(schema[tableTsName], Table)) {
    throw new Error(`Table ${tableTsName} not found in schema`)
  }
  return schema[tableTsName]
}

const getExtraField = (tableRelational: TableRelationalConfig, identifierColumn?: string) => {
  const extraWith: [string, SQL.Aliased<string | number>][] = []
  const primaryKeyColumn = tableRelational.primaryKey[0]

  extraWith.push(['__pk', sql`${primaryKeyColumn}`.as('__pk') as SQL.Aliased<string | number>])

  if (identifierColumn) {
    const identifierKeyColumn = tableRelational.columns[identifierColumn]

    extraWith.push(['__id', sql`${identifierKeyColumn}`.as('__id') as SQL.Aliased<string | number>])
  }

  return Object.fromEntries(extraWith)
}

export function createDrizzleQuery(
  fields: Fields,
  table: Record<string, TableRelationalConfig>,
  tableRelationalConfig: TableRelationalConfig,
  identifierColumn?: string
): Record<string, any> {
  const queryColumns = Object.fromEntries(
    Object.values(fields).flatMap((field) => {
      if (field.$client.source !== 'column') return []
      return [[field.$client.columnTsName, true as const]]
    })
  )

  const queryWith = Object.fromEntries(
    Object.values(fields).flatMap((field) => {
      if (!isRelationField(field)) return []
      const relationName = field.$server.relation.fieldName
      const referencedTableName = field.$client.referencedTableTsName

      return [
        [relationName, createDrizzleQuery(field.fields, table, table[referencedTableName]) as any],
      ]
    })
  )

  return {
    columns: queryColumns,
    with: queryWith,
    extras: getExtraField(tableRelationalConfig, identifierColumn),
  }
}

export function appendFieldNameToFields<TFields extends Fields>(
  fields: TFields
): Simplify<TFields> {
  return Object.fromEntries(
    Object.entries(fields).map(([key, field]) => {
      field.$client.fieldName = key
      field.$server.fieldName = key
      return [key, field]
    })
  ) as TFields
}

export function mapValueToTsValue(fields: Fields, value: Record<string, any>): Record<string, any> {
  const mappedEntries = Object.entries(fields).flatMap(([fieldName, field]) => {
    if (value[fieldName] === undefined) return []
    if (field.$client.source !== 'column') return []
    return [[field.$client.columnTsName, value[fieldName]]]
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

export type ToZodObject<T extends Record<string, any>> = ZodObject<{
  [Key in keyof T]-?: T[Key] extends undefined
    ? ZodOptional<ZodType<NonNullable<T[Key]>>>
    : ZodType<T[Key]>
}>

export type GetTableByTableTsName<
  TFullSchema extends Record<string, unknown>,
  TTableTsName extends keyof TFullSchema,
> = TFullSchema[TTableTsName] extends Table<any> ? TFullSchema[TTableTsName] : never

/**
 * @description Return the default values for each provided fields, This should be used with `create` form
 */
export const getDefaultValueFromFields = (
  fields: FieldsClient,
  storageAdapter?: StorageAdapterClient
) => {
  const mappedCheck = Object.fromEntries(
    Object.entries(
      R.mapValues(fields, (field) => {
        if (isRichTextField(field)) {
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
