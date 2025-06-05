import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig,
  type ExtractTablesWithRelations,
  is,
  Table,
} from 'drizzle-orm'
import type { Simplify } from 'type-fest'

import { createDefaultApiHandlers } from './builder.handler'
import type {
  Collection,
  CollectionConfig,
  FindTableByTableTsName,
  GetAllTableTsNames,
} from './collection'
import type { MinimalContextValue } from './config'
import type { Context, GetContextValueFromContext, RequestContext } from './context'
import {
  type ApiRoute,
  type ApiRouteHandler,
  type ApiRouter,
  type ApiRouteSchema,
  type AppendPrefixPathToApiRoute,
  createEndpoint,
} from './endpoint'
import {
  FieldBuilder,
  type Fields,
  type FieldsInitial,
  type FieldsWithFieldName,
  type OptionCallback,
} from './field'
import { appendFieldNameToFields, type GetTableByTableTsName } from './utils'

export class Builder<
  TFullSchema extends Record<string, unknown>,
  TContextValue extends MinimalContextValue<TFullSchema> = any,
  TContext extends RequestContext<TContextValue, TFullSchema> = RequestContext<
    TContextValue,
    TFullSchema
  >,
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

  $context<
    TContext extends Context<MinimalContextValue<TFullSchema>> = Context<
      MinimalContextValue<TFullSchema>
    >,
    TContextValue extends MinimalContextValue<TFullSchema> = GetContextValueFromContext<TContext>,
  >(): Builder<TFullSchema, TContextValue> {
    return new Builder<TFullSchema, TContextValue>({ schema: this.config.schema })
  }

  collection<
    TSlug extends string = string,
    TTableTsName extends GetAllTableTsNames<TFullSchema> = GetAllTableTsNames<TFullSchema>,
    TFields extends Fields<TContextValue, TFullSchema> = Fields<TContextValue, TFullSchema>,
    TApiRouter extends ApiRouter<TContextValue> = ApiRouter<TContextValue>,
  >(
    tableTsName: TTableTsName,
    config: CollectionConfig<
      TSlug,
      GetTableByTableTsName<TFullSchema, TTableTsName>,
      TContextValue,
      TFields,
      TApiRouter
    >
  ) {
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
      identifierColumn: config.identifierColumn as string,
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
      slug: config.slug,
      fields: config.fields,
      identifierColumn: config.identifierColumn,
      admin: {
        ...config.admin,
        api: {
          create: async (args) => {
            // TODO: Access control
            const defaultApi = config.admin?.api?.create
              ? defaultHandlers.create
              : (undefined as any)
            const result = await api.create({
              ...args,
              defaultApi,
            })
            return result
          },
          update: async (args) => {
            // TODO: Access control
            const defaultApi = config.admin?.api?.update
              ? defaultHandlers.update
              : (undefined as any)
            const result = await api.update({ ...args, defaultApi })
            return result
          },
          delete: async (args) => {
            // TODO: Access control
            const defaultApi = config.admin?.api?.delete
              ? defaultHandlers.delete
              : (undefined as any)
            const result = await api.delete({ ...args, defaultApi })
            return result
          },
          findOne: async (args) => {
            // TODO: Access control
            const defaultApi = config.admin?.api?.findOne
              ? defaultHandlers.findOne
              : (undefined as any)
            const result = await api.findOne({ ...args, defaultApi })
            return result
          },
          findMany: async (args) => {
            // TODO: Access control
            const defaultApi = config.admin?.api?.findMany
              ? defaultHandlers.findMany
              : (undefined as any)
            const result = await api.findMany({ ...args, defaultApi })
            return result
          },
        },
      },
    } as Collection<
      TSlug,
      FindTableByTableTsName<TFullSchema, TTableTsName>['_']['name'],
      TFullSchema,
      TContextValue,
      FieldsWithFieldName<TFields>,
      TApiRouter
    >
  }

  fields<
    TTableTsName extends GetAllTableTsNames<TFullSchema>,
    TFields extends FieldsInitial<TContextValue, TFullSchema>,
  >(
    tableTsName: TTableTsName,
    optionsFn: (
      fb: FieldBuilder<
        TFullSchema,
        ExtractTablesWithRelations<TFullSchema>,
        TTableTsName,
        TContextValue
      >
    ) => TFields
  ): Simplify<FieldsWithFieldName<TFields>> {
    const fb = new FieldBuilder(
      tableTsName,
      this.tableRelationalConfigByTableTsName
    ) as FieldBuilder<
      TFullSchema,
      ExtractTablesWithRelations<TFullSchema>,
      TTableTsName,
      TContextValue
    >
    return appendFieldNameToFields(optionsFn(fb))
  }

  options<TType extends string | number>(
    callback: OptionCallback<TType, TFullSchema, TContextValue>
  ): OptionCallback<TType, TFullSchema, TContextValue> {
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
