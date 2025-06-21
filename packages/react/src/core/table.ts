import type { AnyColumn, AnyTable, Relations } from 'drizzle-orm'
import type { Merge, UnionToIntersection } from 'type-fest'

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

type AnyRelationsFromTableKey<T extends string | number | symbol> = T extends string
  ? {
      [key: string]: Relations<T>
    }
  : never

type AnyRelations<T extends Record<string, unknown>> = UnionToIntersection<
  AnyRelationsFromTableKey<keyof T>
>

type WithAnyTableSchema<T extends Record<string, unknown>> = T & {
  [key: string]: WithAnyTable<any, string>
}

export type WithAnyRelations<
  T extends Record<string, unknown>,
  U extends WithAnyTableSchema<T> = WithAnyTableSchema<T>,
> = Merge<AnyRelations<U>, U>
