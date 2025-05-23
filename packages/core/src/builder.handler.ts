import type { Relation, Table } from 'drizzle-orm'
import {
  eq,
  getTableColumns,
  getTableName,
  is,
  Many,
  One,
  or,
  type TableRelationalConfig,
} from 'drizzle-orm'
import type { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import type { RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query'

import type {
  ApiCreateHandler,
  ApiDeleteHandler,
  ApiFindManyHandler,
  ApiFindOneHandler,
  ApiUpdateHandler,
  CollectionAdminApi,
  InferFields,
} from './collection'
import type { MinimalContext } from './config'
import type { Field, Fields } from './field'
import {
  createDrizzleQuery,
  getColumnTsName,
  getPrimaryColumn,
  getTableFromSchema,
  isRelationField,
} from './utils'

export function createDefaultApiHandlers<
  TContext extends MinimalContext = MinimalContext,
  TFields extends Fields<any> = Fields<any>,
>(args: {
  schema: Record<string, unknown>
  fields: TFields
  tableTsKey: string
  tableNamesMap: Record<string, string>
  tables: Record<string, TableRelationalConfig>
}): CollectionAdminApi<TContext, TFields> {
  const { fields, tableTsKey, tableNamesMap, tables, schema } = args

  const tableRelationalConfig = tables[tableTsKey]
  const primaryKeyColumn = getPrimaryColumn(tableRelationalConfig)
  const tableName = tableRelationalConfig.tsName
  const tableSchema = getTableFromSchema(schema, tableTsKey)
  const queryPayload = createDrizzleQuery(fields)

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

    return mapResultToFields(fields, result) as InferFields<TFields>
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
      data: result.map((result) => mapResultToFields(fields, result)) as InferFields<TFields>[],
      // TODO: Get total from query
      total: 0,
      page: 0,
    }
  }

  const create: ApiCreateHandler<TContext, TFields> = async (args) => {
    const db = args.context.db

    const id = await db.transaction(async (tx) => {
      return new ApiHandler(tableTsKey, fields, {
        schema,
        context: args.context,
        tableRelationalConfigByTableTsName: tables,
        tableTsNameByTableDbName: tableNamesMap,
      }).create(tx, args.data)
    })

    // TODO: It's not correct, fix this
    return { __pk: id, id: id }
  }

  const update: ApiUpdateHandler<TContext, TFields> = async (args) => {
    const db = args.context.db

    await db.transaction(async (tx) => {
      return new ApiHandler(tableTsKey, fields, {
        schema,
        context: args.context,
        tableRelationalConfigByTableTsName: tables,
        tableTsNameByTableDbName: tableNamesMap,
      }).update(args.id, tx, args.data)
    })

    // TODO: It's not correct, fix this
    return { __pk: args.id, id: args.id }
  }

  // why not just delete? why _delete?
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
  private readonly tableRelationalConfig
  private readonly primaryColumn
  private readonly primaryColumnTsName
  private readonly table

  constructor(
    private readonly tableTsName: string,
    private readonly fields: Fields<any>,
    private readonly config: {
      schema: Record<string, unknown>
      context: MinimalContext
      tableTsNameByTableDbName: Record<string, string>
      tableRelationalConfigByTableTsName: Record<string, TableRelationalConfig>
    }
  ) {
    this.tableRelationalConfig = this.config.tableRelationalConfigByTableTsName[tableTsName]
    this.table = getTableFromSchema(this.config.schema, this.tableTsName)
    this.primaryColumn = getPrimaryColumn(this.tableRelationalConfig)
    this.primaryColumnTsName = getColumnTsName(
      getTableColumns(this.config.schema[this.tableTsName] as Table),
      this.primaryColumn
    )
  }

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
    console.log('input', input)
    const oneInput = await this.resolveOneRelations(tx, this.fields, data)
    console.log('oneInput', oneInput)
    const fullInput = { ...input, ...oneInput }
    console.log('fullInput', fullInput)
    const result = (await tx.insert(this.table).values([fullInput]).returning())[0]
    const id = result[this.primaryColumnTsName]
    await this.resolveManyRelations(id, tx, this.fields, data)
    return id
  }

  async update(
    id: string | number,
    tx: PgTransaction<NodePgQueryResultHKT, any, any>,
    data: Record<string, any>
  ): Promise<string | number> {
    const input = this.getColumnValues(this.fields, data)
    console.log('[update] input', input)
    const oneInput = await this.resolveOneRelations(tx, this.fields, data)
    console.log('[update] oneInput', oneInput)
    const fullInput = { ...input, ...oneInput }
    console.log('[update] fullInput', fullInput)
    const result = (
      await tx.update(this.table).set([fullInput]).where(eq(this.primaryColumn, id)).returning()
    )[0]
    id = result[this.primaryColumnTsName]
    await this.resolveManyRelations(id, tx, this.fields, data)
    return id
  }

  private async resolveOneRelations(
    tx: PgTransaction<NodePgQueryResultHKT, any, any>,
    fields: Fields<any>,
    data: Record<string, any>
  ) {
    const create = async (referencedTable: Table, fields: Fields<any>, value: any) => {
      const id = await new ApiHandler(
        // TODO: i think this should not use public prefix to search the table
        this.config.tableTsNameByTableDbName[`public.${getTableName(referencedTable)}`],
        fields,
        this.config
      ).create(tx, value)

      return id
    }

    const result = await Promise.all(
      Object.entries(fields).flatMap(async ([fieldName, field]) => {
        if (!isRelationField(field) || !is(field._.relation, One)) return []

        const relationFields = field._.relation.config?.fields ?? []

        if (relationFields.length !== 1) {
          throw new Error('Relation fields must be 1. Multiple relations not supported')
        }

        const relationField = relationFields[0]
        const relationFieldTsName = getColumnTsName(getTableColumns(this.table), relationField)

        const value = data[fieldName]

        // Case that call with undefined value of relation like update data without update the relation
        if (value === undefined) return []

        // TODO: map key from field to ts
        switch (field.type) {
          case 'connectOrCreate': {
            if (typeof value === 'string' || typeof value === 'number') {
              return [relationFieldTsName, value]
            }

            return [
              relationFieldTsName,
              await create(field._.relation.referencedTable, field.fields, value),
            ]
          }
          case 'connect': {
            return [relationFieldTsName, value]
          }
          case 'create': {
            return [
              relationFieldTsName,
              await create(field._.relation.referencedTable, field.fields, value),
            ]
          }
        }
      })
    )

    const resolvedRelationsMap = Object.fromEntries(result.filter((r) => r.length > 0))
    return resolvedRelationsMap
  }

  private async resolveManyRelations(
    id: string | number,
    tx: PgTransaction<NodePgQueryResultHKT, any, any>,
    fields: Record<string, Field<any>>,
    data: Record<string, any>
  ) {
    // update the referenced table to have this id
    const connect = async (tableConfig: TableRelationalConfig, relation: Relation, value: any) => {
      const referencedFieldName = this.findReferencedColumnFromManyRelation(relation)

      const primaryColumn = getPrimaryColumn(tableConfig)
      await tx
        .update(this.config.schema[tableConfig.tsName] as Table)
        .set({ [referencedFieldName]: id })
        .where(eq(primaryColumn, value))
    }

    const create = async (tableConfig: TableRelationalConfig, relation: Relation, value: any) => {
      const referencedFieldTsName = this.findReferencedColumnFromManyRelation(relation)
      const payload = {
        ...value,
        [referencedFieldTsName]: id,
      }
      await tx
        .insert(this.config.schema[tableConfig.tsName] as Table)
        .values([payload])
        .returning()
    }

    const resultPromises = Object.entries(fields).flatMap(async ([fieldName, field]) => {
      // Filter out non-relation fields
      if (!isRelationField(field)) return []
      if (!is(field._.relation, Many)) return []
      const values = data[fieldName] as any[]
      if (!values || values.length === 0) return []

      const promises = values.map(async (value) => {
        const sourceTableRelationalConfig =
          this.config.tableRelationalConfigByTableTsName[field._.referencedTableTsName]

        const _connectFn = () => connect(sourceTableRelationalConfig, field._.relation, value)
        const _createFn = () => create(sourceTableRelationalConfig, field._.relation, value)

        switch (field.type) {
          case 'connectOrCreate': {
            if (typeof value === 'string' || typeof value === 'number') {
              return [[fieldName, await _connectFn()]] as const
            }
            return [[fieldName, await _createFn()]] as const
          }
          case 'connect':
            return [[fieldName, await _connectFn()]] as const
          case 'create':
            return [[fieldName, await _createFn()]] as const
        }
      })

      return await Promise.all(promises)
    })

    await Promise.all(resultPromises)
  }

  /**
   * This function is designed to find the referenced column from a many-to-one relation.
   * For example,
   *
   * const posts = pgTable('posts', {
   *   id: serial('id').primaryKey(),
   *   authorId: integer('author_id').notNull(),
   * })
   *
   * const authors = pgTable('authors', {
   *   id: serial('id').primaryKey(),
   * })
   *
   * const postsRelation = relation(posts, {
   *   author: one(authors, {
   *     fields: [posts.authorId],
   *     references: [authors.id],
   *   }),
   * })
   *
   * const authorsRelation = relation(authors, {
   *   posts: many(posts)
   * })
   *
   * In this case, if we call `findReferencedColumnFromManyRelation(authorsConfig, "posts")`,
   * it will return "authorId" of "posts" table as the referenced column.
   *
   * First, it finds "authorsRelation" and check the relation field named "posts".
   * Then, it loops through the relations of "posts" (postsRelation) and finds the relation of "authors".
   * Finally, it returns the field name of the relation "posts.authorId".
   */
  private findReferencedColumnFromManyRelation(relation: Relation) {
    if (!is(relation, Many)) {
      throw new Error(`Relation of "${relation.referencedTableName}" is not Many. Try to fix it`)
    }

    const referencedTableRelationalConfig = Object.values(
      this.config.tableRelationalConfigByTableTsName
    ).find((value) => {
      return value.dbName === relation.referencedTableName
    })
    if (!referencedTableRelationalConfig) {
      throw new Error(`Referenced Table "${relation.referencedTableName}" not found`)
    }

    const relationField = Object.values(referencedTableRelationalConfig.relations).find(
      (relation) => {
        return getTableName(relation.sourceTable) === referencedTableRelationalConfig.dbName
      }
    )
    if (!relationField) {
      throw new Error(`Relation field "${relation.referencedTableName}" not found`)
    }
    if (!is(relationField, One)) {
      throw new Error(`Relation field "${relation.referencedTableName}" is not One. Try to fix it`)
    }

    const fields = relationField.config?.fields ?? []
    if (fields.length !== 1) {
      throw new Error('Relation fields must be 1. Multiple relations not supported')
    }
    const column = fields[0]
    const referenceFieldName = getColumnTsName(referencedTableRelationalConfig.columns, column)
    return referenceFieldName
  }

  private getColumnValues(fields: Fields, data: Record<string, any>): Record<string, any> {
    const result = Object.fromEntries(
      Object.entries(fields).flatMap(([_, field]) => {
        if (field._.source === 'columns' && data[field.fieldName]) {
          return [[field._.columnTsName, data[field.fieldName]]]
        }
        return []
      })
    )
    return result
  }
}

function mapResultToFields(fields: Fields<any>, result: Record<string, any>): Record<string, any> {
  const mappedResult = Object.fromEntries(
    Object.entries(fields).flatMap(([fieldName, field]) => {
      if (field._.source === 'columns') {
        const value = result[field._.columnTsName]
        if (!value) return []
        return [[field.fieldName, value]]
      }
      if (isRelationField(field)) {
        const value = result[field._.relationTsName]
        if (!value) return []

        // TODO: This might break for sure
        if (field.type === 'connectOrCreate') {
          return [[fieldName, value]]
        }

        if (field.type === 'create') {
          return [[field.fieldName, mapResultToFields(field.fields, value)]]
        } else if (field.type === 'connect') {
          const primaryColumnTsName = field._.primaryColumnTsName
          if (Array.isArray(value)) {
            const values = value.map((v) => v[primaryColumnTsName])
            return [[field.fieldName, values]]
          }

          return [[field.fieldName, value[primaryColumnTsName]]]
        }
      }
      return []
    })
  )

  return mappedResult
}
