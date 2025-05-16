import { Column, eq, getTableName, Many, One, or, Table, TableRelationalConfig } from 'drizzle-orm'
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import { PgTransaction } from 'drizzle-orm/pg-core'
import { RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query'

import {
  ApiCreateHandler,
  ApiDeleteHandler,
  ApiFindManyHandler,
  ApiFindOneHandler,
  ApiUpdateHandler,
  CollectionAdminApi,
  CollectionConfig,
  InferFields,
} from './collection'
import { MinimalContext } from './config'
import { Field } from './field'
import {
  createDrizzleQuery,
  getColumnTsName,
  getPrimaryColumn,
  getTableFromSchema,
  isRelationField,
} from './utils'

export function createDefaultApiHandlers<
  TSlug extends string = string,
  TContext extends MinimalContext = MinimalContext,
  TFields extends Record<string, Field<TContext>> = Record<string, Field<TContext>>,
>(args: {
  schema: Record<string, unknown>
  collectionConfig: CollectionConfig<TSlug, TContext, TFields>
  tableKey: string
  tableNamesMap: Record<string, string>
  tables: Record<string, TableRelationalConfig>
}): CollectionAdminApi<TContext, TFields> {
  const { collectionConfig, tableKey, tableNamesMap, tables, schema } = args

  const tableRelationalConfig = tables[tableKey]
  const primaryKeyColumn = getPrimaryColumn(tableRelationalConfig)
  const tableName = tableRelationalConfig.tsName
  const tableSchema = getTableFromSchema(schema, tableKey)
  const queryPayload = createDrizzleQuery(collectionConfig.fields)

  const findOne: ApiFindOneHandler<TContext, TFields> = async (args) => {
    const db = args.context.db
    const query = db.query[tableName as keyof typeof db.query] as RelationalQueryBuilder<any, any>
    const result = await query.findFirst({
      ...queryPayload,
      where: eq(primaryKeyColumn, args.id),
    })
    if (!result) {
      // TODO: Custom error
      throw new Error('Record not found')
    }

    return mapResultToFields(collectionConfig.fields, result) as InferFields<TFields>
  }

  const findMany: ApiFindManyHandler<TContext, TFields> = async (args) => {
    const db = args.context.db
    const query = db.query[tableName as keyof typeof db.query] as RelationalQueryBuilder<any, any>

    const orderType = args.orderType ?? 'asc'
    const orderBy = args.orderBy

    const result = await query.findMany({
      ...queryPayload,
      limit: args.limit,
      offset: args.offset,
      orderBy: orderBy
        ? (fields, { asc, desc }) => {
            if (orderType === 'desc') return desc(fields[orderBy])
            return asc(fields[orderBy])
          }
        : undefined,
    })

    return {
      data: result.map((result) =>
        mapResultToFields(collectionConfig.fields, result)
      ) as InferFields<TFields>[],
      // TODO: Get total from query
      total: 0,
      page: 0,
    }
  }

  const create: ApiCreateHandler<TContext, TFields> = async (args) => {
    const db = args.context.db
    const id = await db.transaction(async (tx) => {
      return new ApiHandler(tableKey, collectionConfig.fields, {
        schema,
        context: args.context,
        tables,
        tableNamesMap,
      }).create(tx, args.data)
    })

    return { id }
  }

  const update: ApiUpdateHandler<TContext, TFields> = async (args) => {
    const db = args.context.db

    await db.transaction(async (tx) => {
      return new ApiHandler(tableKey, collectionConfig.fields, {
        schema,
        context: args.context,
        tables,
        tableNamesMap,
      }).update(tx, args.data)
    })

    return { id: args.id }
  }

  const _delete: ApiDeleteHandler<TContext, TFields> = async (args) => {
    const db = args.context.db

    await db
      .delete(tableSchema)
      .where(or(...args.ids.map((id) => eq(primaryKeyColumn, id))))
      .returning()
  }

  return {
    findOne: findOne,
    findMany: findMany,
    create: create,
    update: update,
    delete: _delete,
  }
}

class ApiHandler {
  private readonly tableRelationalConfig = this.config.tables[this.tableKey]
  private readonly primaryColumn = getPrimaryColumn(this.tableRelationalConfig)
  private readonly primaryColumnName = getColumnTsName(
    this.config.schema[this.tableKey] as Table,
    this.primaryColumn
  )
  private readonly tableSchema = getTableFromSchema(this.config.schema, this.tableKey)

  constructor(
    private readonly tableKey: string,
    private readonly fields: Record<string, Field<any>>,
    private readonly config: {
      schema: Record<string, unknown>
      context: MinimalContext
      tables: Record<string, TableRelationalConfig>
      tableNamesMap: Record<string, string>
    }
  ) {}

  // Case 1: connect to one e.g. posts to author
  // Get field author, authorId, and put it in the payload

  // Case 2: connect to many e.g. categories to posts
  // TODO: Get table postsToTags,

  // Case 3: create to one e.g. posts to author
  // Get field author from payload, create author and get its id, put it in the payload

  // Case 4: create to many e.g, posts to postsToTags
  // Get field postsToTags from payload, create postsToTags and get its id, put it in the payload. Create many

  // Case 5: connectOrCreate to one
  // Case 1 + Case 3

  // Case 6: connectOrCreate to many
  // Case 2 + Case 4

  async create(
    tx: PgTransaction<NodePgQueryResultHKT, any, any>,
    data: Record<string, any>
  ): Promise<string | number> {
    const input = this.getColumnValues(this.fields, data)
    const oneInput = await this.resolveOneRelations(tx, this.fields, data)
    const fullInput = { ...input, ...oneInput.query }
    const result = (await tx.insert(this.tableSchema).values([fullInput]).returning())[0]
    const id = result[this.primaryColumnName]
    await this.resolveManyRelations(id, tx, this.fields, data)

    return id as string | number
  }

  async update(
    tx: PgTransaction<NodePgQueryResultHKT, any, any>,
    data: Record<string, any>
  ): Promise<string | number> {
    const input = this.getColumnValues(this.fields, data)
    const oneInput = this.resolveOneRelations(tx, this.fields, data)
    const fullInput = { ...input, ...oneInput }
    const result = (await tx.update(this.tableSchema).set([fullInput]).returning())[0]
    const id = result[this.primaryColumnName]
    await this.resolveManyRelations(id, tx, this.fields, data)

    return id as string | number
  }

  private async resolveOneRelations(
    tx: PgTransaction<NodePgQueryResultHKT, any, any>,
    fields: Record<string, Field<any>>,
    data: Record<string, any>
  ) {
    const connect = async (table: Table, primaryColumn: Column, value: any) => {
      const primaryKeyFieldName = getColumnTsName(table, primaryColumn)
      return { [primaryKeyFieldName]: value }
    }

    const create = async (
      table: Table,
      primaryColumn: Column,
      fields: Record<string, Field>,
      value: any
    ) => {
      const primaryKeyFieldName = getColumnTsName(table, primaryColumn)

      const id = await new ApiHandler(
        this.config.tableNamesMap[getTableName(table)],
        fields,
        this.config
      ).create(tx, value)

      return { [primaryKeyFieldName]: id }
    }

    const result = Object.entries(fields).flatMap(async ([key, field]) => {
      if (isRelationField(field) && field._.$relation instanceof One) {
        const value = data[key]

        const referencedTable = field._.$relation.referencedTable
        const referencedTableRelationalConfig =
          this.config.tables[this.config.tableNamesMap[field._.$relation.referencedTableName]]
        const primaryColumn = getPrimaryColumn(referencedTableRelationalConfig)

        switch (field.type) {
          case 'connectOrCreate': {
            if (typeof value === 'string' || typeof value === 'number') {
              return [[key, await connect(referencedTable, primaryColumn, value)]] as const
            }

            return [
              [key, await create(referencedTable, primaryColumn, field.fields, value)],
            ] as const
          }
          case 'connect': {
            return [[key, await connect(referencedTable, primaryColumn, value)]] as const
          }
          case 'create': {
            return [
              [key, await create(referencedTable, primaryColumn, field.fields, value)],
            ] as const
          }
        }
      }

      return []
    })

    const resolvedResult = await Promise.all(result)
    const resolvedRelationsMap = Object.fromEntries(resolvedResult)
    return resolvedRelationsMap
  }

  private async resolveManyRelations(
    id: string | number,
    tx: PgTransaction<NodePgQueryResultHKT, any, any>,
    fields: Record<string, Field<any>>,
    data: Record<string, any>
  ) {
    // update the referenced table to have this id
    const connect = async (
      table: Table,
      tableRelationalConfig: TableRelationalConfig,
      referencedTable: Table,
      value: any
    ) => {
      const primaryColumn = getPrimaryColumn(tableRelationalConfig)
      const referencedFieldName = this.findReferencedFieldName(
        table,
        tableRelationalConfig,
        referencedTable
      )

      await tx
        .update(table)
        .set({ [referencedFieldName]: id })
        .where(eq(primaryColumn, value))
    }

    const create = async (
      table: Table,
      tableRelationalConfig: TableRelationalConfig,
      referencedTable: Table,
      value: any
    ) => {
      const referencedFieldName = this.findReferencedFieldName(
        table,
        tableRelationalConfig,
        referencedTable
      )
      const payload = {
        ...value,
        [referencedFieldName]: id,
      }
      await tx.insert(table).values([payload]).returning()
    }

    const resultPromises = Object.entries(fields).flatMap(async ([key, field]) => {
      // Filter out non-relation fields
      if (!isRelationField(field)) {
        return []
      }

      if (field._.$relation instanceof Many) {
        const values = data[key] as any[]

        const promises = values.map(async (value) => {
          const referencedTable = field._.$relation.referencedTable
          const referencedTableRelationalConfig = this.config.tables[
            this.config.tableNamesMap[field._.$relation.referencedTableName]
          ] as TableRelationalConfig

          const _connectFn = () =>
            connect(referencedTable, referencedTableRelationalConfig, this.tableSchema, value)

          const _createFn = () =>
            create(referencedTable, referencedTableRelationalConfig, this.tableSchema, value)

          switch (field.type) {
            case 'connectOrCreate': {
              if (typeof value === 'string' || typeof value === 'number') {
                return [[key, await _connectFn()]] as const
              }
              return [[key, await _createFn()]] as const
            }
            case 'connect':
              return [[key, await _connectFn()]] as const
            case 'create':
              return [[key, await _createFn()]] as const
          }
        })

        return await Promise.all(promises)
      }

      return []
    })

    await Promise.all(resultPromises)
  }

  private findReferencedFieldName(
    table: Table,
    tableRelationalConfig: TableRelationalConfig,
    referencedTable: Table
  ) {
    const relation = Object.values(tableRelationalConfig.relations).find((relation) => {
      return relation.referencedTableName === getTableName(referencedTable)
    })

    if (!relation) throw new Error('Relation not found')

    const referencedColumn = Object.values(tableRelationalConfig.columns).find((column) => {
      return column._.name === relation.fieldName
    })

    if (!referencedColumn) throw new Error('Referenced column not found')

    const referenceFieldName = getColumnTsName(table, referencedColumn)
    return referenceFieldName
  }

  private getColumnValues(
    fields: Record<string, Field<any>>,
    data: Record<string, any>
  ): Record<string, any> {
    const result = Object.fromEntries(
      Object.entries(fields).flatMap(([key, field]) => {
        if (field._.$source === 'columns') return [[field._.$columnTsName, data[key]]]
        return []
      })
    )

    return result
  }
}

// TODO: Fix this
// TODO: Considering adding "_id" for every output field
function mapResultToFields(
  fields: Record<string, Field<any>>,
  result: Record<string, any>
): Record<string, any> {
  const mappedResult = Object.fromEntries(
    Object.entries(fields).flatMap(([key, field]) => {
      const value = result[key]
      if (field._.$source === 'columns') {
        return [[field._.$columnTsName, value]]
      }
      if (isRelationField(field)) {
        if (field.type === 'create') {
          return [[field._.$fieldName, mapResultToFields(field.fields, value)]]
        } else if (field.type === 'connect') {
          const primaryColumnTsName = field._.$primaryColumnTsName
          return [[field._.$fieldName, value[primaryColumnTsName]]]
        }
      }
      return []
    })
  )

  return mappedResult
}
