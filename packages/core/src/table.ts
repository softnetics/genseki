import type { AnyColumn, AnyTable } from 'drizzle-orm'

export type AnyTypedColumn<T> = AnyColumn & { _: { data: T; dialect: 'pg' } }
export type WithHasDefault<T> = T & { _: { hasDefault: true } }
export type WithNotNull<T> = T & { _: { notNull: true } }
export type WithAnyTable<TColumns extends Record<string, AnyColumn>> = AnyTable<{
  dialect: 'pg'
  columns: TColumns
}> &
  TColumns
