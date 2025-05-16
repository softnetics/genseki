import { Column, getTableColumns, getTableName, Table, TableRelationalConfig } from 'drizzle-orm'

import { Field, FieldRelation } from './field'

export function isRelationField(field: Field): field is FieldRelation {
  return field._.$source === 'relations'
}

export function getPrimaryColumn(tableConfig: TableRelationalConfig) {
  if (tableConfig.primaryKey.length > 1) {
    throw new Error(
      'Primary key must be a single column. Multiple column primary keys are not supported yet.'
    )
  }

  const primaryKeyColumn = tableConfig.primaryKey[0]
  return primaryKeyColumn
}

export function getColumnTsName(table: Table, column: Column) {
  const field = Object.entries(getTableColumns(table)).find(([_, col]) => {
    return col._.name === column._.name
  })
  if (!field) throw new Error(`Column ${column.name} not found in table ${getTableName(table)}`)
  return field[0]
}

export function createColumnKeyToFieldMap(
  fields: Record<string, Field<any>>
): Map<string, Field<any>> {
  return new Map(
    Object.values(fields).flatMap((field) => {
      return [[field._.$columnTsName, field]]
    })
  )
}

export function getTableFromSchema(schema: Record<string, unknown>, tableKey: string): Table {
  if (!(schema[tableKey] instanceof Table)) {
    throw new Error(`Table ${tableKey} not found in schema`)
  }
  return schema[tableKey]
}

export function createDrizzleQuery(fields: Record<string, Field<any>>): Record<string, any> {
  const queryColumns = Object.fromEntries(
    Object.values(fields).flatMap((field) => {
      if (field._.$source !== 'columns') return []
      const columnName = field._.$column.name
      return [[columnName, true as const]]
    })
  )

  const queryWith = Object.fromEntries(
    Object.values(fields).flatMap((field) => {
      if (!isRelationField(field)) return []
      const relationName = field._.$relation.fieldName
      if (field.type === 'create' || field.type === 'connectOrCreate') {
        return [[relationName, createDrizzleQuery(field.fields) as any]]
      }
      return [[relationName, true as const]]
    })
  )

  return {
    columns: queryColumns,
    with: queryWith,
  }
}
