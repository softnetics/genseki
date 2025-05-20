import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig,
  ExtractTablesWithRelations,
  is,
  Table,
} from 'drizzle-orm'
import { Simplify } from 'type-fest'

import { createDefaultApiHandlers } from './builder.handler'
import {
  Collection,
  CollectionConfig,
  FindTableByTableTsName,
  GetAllTableTsNames,
} from './collection'
import { MinimalContext } from './config'
import {
  ApiRoute,
  ApiRouteHandler,
  ApiRouter,
  ApiRouteSchema,
  AppendPrefixPathToApiRoute,
  createEndpoint,
} from './endpoint'
import { FieldBuilder, Fields, FieldsInitial, FieldsWithFieldName, OptionCallback } from './field'
import { appendFieldNameToFields } from './utils'

export class Builder<
  TFullSchema extends Record<string, unknown>,
  TContext extends MinimalContext<TFullSchema> = MinimalContext<TFullSchema>,
> {
  private readonly tableRelationalConfigByTableTsName: ExtractTablesWithRelations<TFullSchema>
  private readonly tableTsNameByTableDbName: Record<string, string>

  constructor(private readonly config: { schema: TFullSchema }) {
    const tablesConfig = extractTablesRelationalConfig(
      this.config.schema,
      createTableRelationsHelpers
    )

    this.tableRelationalConfigByTableTsName =
      tablesConfig.tables as ExtractTablesWithRelations<TFullSchema>
    this.tableTsNameByTableDbName = tablesConfig.tableNamesMap
  }

  $context<TContext extends MinimalContext<TFullSchema>>(): Builder<TFullSchema, TContext> {
    return new Builder<TFullSchema, TContext>({ schema: this.config.schema })
  }

  collection<
    TSlug extends string = string,
    TTableKey extends GetAllTableTsNames<TFullSchema> = GetAllTableTsNames<TFullSchema>,
    TFields extends Fields<TContext> = Fields<TContext>,
    TApiRouter extends ApiRouter<TContext> = ApiRouter<TContext>,
  >(tableTsName: TTableKey, config: CollectionConfig<TSlug, TContext, TFields, TApiRouter>) {
    const table = this.config.schema[tableTsName]
    const tableRelationalConfig =
      this.tableRelationalConfigByTableTsName[
        tableTsName as unknown as keyof typeof this.tableRelationalConfigByTableTsName
      ]

    if (!is(table, Table)) {
      throw new Error(`Table ${tableTsName as string} not found`)
    }

    const defaultHandlers = createDefaultApiHandlers({
      schema: this.config.schema,
      fields: config.fields,
      tableTsKey: tableTsName,
      tables: this.tableRelationalConfigByTableTsName,
      tableNamesMap: this.tableTsNameByTableDbName,
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
        table: table,
        tableConfig: tableRelationalConfig,
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
      FindTableByTableTsName<TFullSchema, TTableKey>['_']['name'],
      TFullSchema,
      TContext,
      FieldsWithFieldName<TFields>,
      TApiRouter
    >
  }

  fields<
    TTableTsName extends GetAllTableTsNames<TFullSchema>,
    TFields extends FieldsInitial<TContext>,
  >(
    tableTsName: TTableTsName,
    optionsFn: (
      fb: FieldBuilder<TFullSchema, ExtractTablesWithRelations<TFullSchema>, TTableTsName, TContext>
    ) => TFields
  ): Simplify<FieldsWithFieldName<TFields>> {
    const fb = new FieldBuilder(
      tableTsName,
      this.tableRelationalConfigByTableTsName
    ) as FieldBuilder<TFullSchema, ExtractTablesWithRelations<TFullSchema>, TTableTsName, TContext>
    return appendFieldNameToFields(optionsFn(fb))
  }

  options<TType extends string | number>(callback: OptionCallback<TType, TContext>) {
    return callback
  }

  endpoint<const TApiEndpointSchema extends ApiRouteSchema>(
    args: TApiEndpointSchema,
    handler: ApiRouteHandler<TContext, TApiEndpointSchema>
  ): AppendPrefixPathToApiRoute<ApiRoute<TContext, TApiEndpointSchema>, '/api'> {
    const prefixPath = '/api'
    args.path = `${prefixPath}${args.path}`
    return createEndpoint(args, handler) as AppendPrefixPathToApiRoute<
      ApiRoute<TContext, TApiEndpointSchema>,
      '/api'
    >
  }
}
