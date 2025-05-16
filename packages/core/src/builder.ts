import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig,
  ExtractTablesWithRelations,
  getTableName,
  Table,
} from 'drizzle-orm'

import { createDefaultApiHandlers } from './builder.handler'
import { Collection, CollectionConfig, FindTableByTableKey, GetAllTableKeys } from './collection'
import { MinimalContext } from './config'
import { ApiRoute, ApiRouteHandler, ApiRouter, ApiRouteSchema, createEndpoint } from './endpoint'
import { Field, FieldBuilder, OptionCallback } from './field'

export class Builder<
  TFullSchema extends Record<string, unknown>,
  TContext extends MinimalContext<TFullSchema> = MinimalContext<TFullSchema>,
> {
  private readonly tables: ExtractTablesWithRelations<TFullSchema>
  private readonly tableNamesMap: Record<string, string>

  constructor(private readonly builderOptions: { schema: TFullSchema; context?: TContext }) {
    const tablesConfig = extractTablesRelationalConfig(
      this.builderOptions.schema,
      createTableRelationsHelpers
    )

    this.tables = tablesConfig.tables as ExtractTablesWithRelations<TFullSchema>
    this.tableNamesMap = tablesConfig.tableNamesMap
  }

  collection<
    TSlug extends string = string,
    TTableKey extends GetAllTableKeys<TFullSchema> = GetAllTableKeys<TFullSchema>,
    const TFields extends Record<string, Field<TContext>> = Record<string, Field<TContext>>,
    const TApiRouter extends ApiRouter = ApiRouter,
  >(tableKey: TTableKey, config: CollectionConfig<TSlug, TContext, TFields, TApiRouter>) {
    const tableSchema = this.builderOptions.schema[tableKey]
    const tableConfig = this.tables[tableKey as unknown as keyof typeof this.tables]

    if (!(tableSchema instanceof Table)) {
      throw new Error(`Table ${tableKey as string} not found`)
    }

    const defaultHandlers = createDefaultApiHandlers({
      schema: this.builderOptions.schema,
      collectionConfig: config,
      tableKey: tableKey,
      tables: this.tables,
      tableNamesMap: this.tableNamesMap,
    })

    const api = {
      create: config.admin?.api?.create ?? defaultHandlers.create,
      update: config.admin?.api?.update ?? defaultHandlers.update,
      delete: config.admin?.api?.delete ?? defaultHandlers.delete,
      findOne: config.admin?.api?.findOne ?? defaultHandlers.findOne,
      findMany: config.admin?.api?.findMany ?? defaultHandlers.findMany,
    }

    return {
      _: {
        $table: tableSchema,
        $tableConfig: tableConfig,
      },
      ...config,
      admin: {
        ...config.admin,
        api: {
          create: async (args) => {
            // TODO: Access control
            const result = await api.create(args)
            return result
          },
          update: async (args) => {
            // TODO: Access control
            const result = await api.update(args)
            return result
          },
          delete: async (args) => {
            // TODO: Access control
            const result = await api.delete(args)
            return result
          },
          findOne: async (args) => {
            // TODO: Access control
            const result = await api.findOne(args)
            return result
          },
          findMany: async (args) => {
            // TODO: Access control
            const result = await api.findMany(args)
            return result
          },
        },
      },
    } as Collection<
      TSlug,
      FindTableByTableKey<TFullSchema, TTableKey>['_']['name'],
      TFullSchema,
      TContext,
      TFields,
      TApiRouter
    >
  }

  fieldsFrom<TTableKey extends GetAllTableKeys<TFullSchema>>(
    tableKey: TTableKey
  ): FieldBuilder<TFullSchema, FindTableByTableKey<TFullSchema, TTableKey>['_']['name'], TContext> {
    const fullSchema = this.builderOptions.schema
    const value = fullSchema[tableKey as keyof typeof fullSchema]

    if (!(value instanceof Table)) {
      throw new Error(`Table ${tableKey as string} not found`)
    }

    return new FieldBuilder(fullSchema, getTableName(value), this.builderOptions.context)
  }

  options<TType extends string | number>(callback: OptionCallback<TType, TContext>) {
    return callback
  }

  endpoint<const TApiEndpointSchema extends ApiRouteSchema>(
    args: TApiEndpointSchema,
    handler: ApiRouteHandler<TContext, TApiEndpointSchema>
  ): ApiRoute<TContext, TApiEndpointSchema> {
    return createEndpoint(args, handler)
  }
}
