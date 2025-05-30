import type { Column, SQL, TableRelationalConfig } from 'drizzle-orm'
import { is, sql, Table } from 'drizzle-orm'
import type { IsNever, Simplify, ValueOf } from 'type-fest'
import type { ZodIssue, ZodObject, ZodOptional, ZodType } from 'zod'

import type {
  ApiHttpStatus,
  ApiRouteHandler,
  ApiRouteHandlerPayloadWithContext,
  ApiRouteSchema,
} from './endpoint'
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
  fields: Fields<any>,
  table: Record<string, TableRelationalConfig>,
  tableRelationalConfig: TableRelationalConfig,
  identifierColumn?: string
): Record<string, any> {
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
      const referencedTableName = field._.relation.referencedTableName
      console.log('Referenced table name: ', referencedTableName, table[referencedTableName])

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
    if (field._.source !== 'column') return []
    return [[field._.columnTsName, value[fieldName]]]
  })

  return Object.fromEntries(mappedEntries.filter((r) => r.length > 0))
}

export async function validateRequestBody<
  TApiRouteSchema extends ApiRouteSchema = any,
  TContext extends Record<string, unknown> = Record<string, unknown>,
>(schema: TApiRouteSchema, payload: ApiRouteHandlerPayloadWithContext<TApiRouteSchema, TContext>) {
  let zodErrors:
    | Partial<Record<'query' | 'pathParams' | 'headers' | 'body', ZodIssue[]>>
    | undefined

  if (schema.query) {
    const err = await schema.query.safeParseAsync((payload as any).query)
    if (!err.success) {
      zodErrors = {
        ...zodErrors,
        query: err.error.issues,
      }
    }
  }

  if (schema.pathParams) {
    const err = await schema.pathParams.safeParseAsync((payload as any).pathParams)
    if (!err.success) {
      zodErrors = {
        ...zodErrors,
        pathParams: err.error.issues,
      }
    }
  }

  if (schema.headers) {
    const err = await schema.headers.safeParseAsync(payload.headers)
    if (!err.success) {
      zodErrors = {
        ...zodErrors,
        headers: err.error.issues,
      }
    }
  }

  if (schema.method !== 'GET' && schema.body) {
    const err = await schema.body.safeParseAsync((payload as any).body)
    if (!err.success) {
      zodErrors = {
        ...zodErrors,
        body: err.error.issues,
      }
    }
  }

  return zodErrors
}

export function validateResponseBody<TApiRouteSchema extends ApiRouteSchema = any>(
  schema: TApiRouteSchema,
  statusCode: ApiHttpStatus,
  response: any
) {
  if (!schema.responses[statusCode]) {
    throw new Error(`No response schema defined for status code ${statusCode}`)
  }

  const result = schema.responses[statusCode].safeParse(response)
  return result.error
}

export function withValidator<
  TApiRouteSchema extends ApiRouteSchema,
  TContext extends Record<string, unknown>,
>(
  schema: TApiRouteSchema,
  handler: ApiRouteHandler<TContext, TApiRouteSchema>
): ApiRouteHandler<TContext, TApiRouteSchema> {
  const wrappedHandler = async (
    payload: ApiRouteHandlerPayloadWithContext<TApiRouteSchema, TContext>
  ) => {
    const zodErrors = await validateRequestBody(schema, payload)
    if (zodErrors) {
      return {
        status: 400,
        body: {
          error: 'Validation failed',
          details: zodErrors,
        },
      }
    }

    const response = await handler(payload)

    const validationError = validateResponseBody(
      schema,
      response.status as ApiHttpStatus,
      response.body
    )

    if (validationError) {
      return {
        status: 500,
        body: {
          error: 'Response validation failed',
          details: validationError.issues,
        },
      }
    }

    return response
  }

  return wrappedHandler as ApiRouteHandler<TContext, TApiRouteSchema>
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
