import type { Column, TableRelationalConfig } from 'drizzle-orm'
import { is, Table } from 'drizzle-orm'
import type { IsNever, Simplify, ValueOf } from 'type-fest'
import type { ZodObject, ZodOptional, ZodType } from 'zod'

import type { Field, FieldRelation, Fields, FieldsInitial, FieldsWithFieldName } from './field'

export function isRelationField(field: Field): field is FieldRelation {
  return field._.source === 'relation'
}

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

export function createDrizzleQuery(fields: Fields<any>): Record<string, any> {
  const queryColumns = Object.fromEntries(
    Object.values(fields).flatMap((field) => {
      if (field._.source !== 'column') return []
      return [[field._.columnTsName, true as const]]
    })
  )

  const queryWith = Object.fromEntries(
    Object.values(fields).flatMap((field) => {
      if (!isRelationField(field)) return []
      const relationName = field._.relation.fieldName

      return [[relationName, createDrizzleQuery(field.fields) as any]]
    })
  )

  return {
    columns: queryColumns,
    with: queryWith,
  }
}

export function appendFieldNameToFields<TFields extends FieldsInitial<any>>(
  fields: TFields
): Simplify<FieldsWithFieldName<TFields>> {
  return Object.fromEntries(
    Object.entries(fields).map(([key, field]) => {
      const fieldWithName = { ...field, fieldName: key }
      return [key, fieldWithName as Field<any> & { fieldName: string }]
    })
  ) as FieldsWithFieldName<TFields>
}

export function mapValueToTsValue(
  fields: Fields<any>,
  value: Record<string, any>
): Record<string, any> {
  const mappedEntries = Object.entries(fields).flatMap(([fieldName, field]) => {
    if (value[fieldName] === undefined) return []
    if (field._.source !== 'columns') return []
    return [[field._.columnTsName, value[fieldName]]]
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
