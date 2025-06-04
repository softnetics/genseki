import type { AnyColumn, AnyTable } from 'drizzle-orm'

export type AnyTypedColumn<T> = AnyColumn & {
  _: {
    data: T
    dataType: T extends string
      ? 'string'
      : T extends number
        ? 'number'
        : T extends boolean
          ? 'boolean'
          : T extends Date
            ? 'date'
            : never
    dialect: 'pg'
  }
} & {}
export type WithHasDefault<T> = T & { _: { hasDefault: true } }
export type WithNotNull<T> = T & { _: { notNull: true } }
export type WithAnyTable<
  TColumns extends Record<string, AnyColumn>,
  TName extends string = string,
> = AnyTable<{
  name: TName
  dialect: 'pg'
  columns: TColumns
}> &
  TColumns
