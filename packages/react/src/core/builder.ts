import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig,
  type ExtractTablesWithRelations,
  is,
  Table,
} from 'drizzle-orm'
import type { Simplify } from 'type-fest'

import { createDefaultApiHandlers } from './builder.handler'
import {
  type Collection,
  type CollectionConfig,
  type FindTableByTableTsName,
  type GetAllTableTsNames,
  getDefaultCollectionAdminApiRouter,
} from './collection'
import type { Context } from './context'
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
  TContext extends Context = Context,
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

  $context<TContext extends Context = Context>(): Builder<TFullSchema, TContext> {
    return new Builder<TFullSchema, TContext>({ schema: this.config.schema })
  }

  collection<
    const TSlug extends string = string,
    const TTableTsName extends GetAllTableTsNames<TFullSchema> = GetAllTableTsNames<TFullSchema>,
    const TFields extends Fields<TContext, TFullSchema> = Fields<TContext, TFullSchema>,
    const TApiRouter extends ApiRouter<TContext> = {},
  >(
    tableTsName: TTableTsName,
    config: CollectionConfig<
      TSlug,
      GetTableByTableTsName<TFullSchema, TTableTsName>,
      TContext,
      TFields,
      TApiRouter
    >
  ): Collection<
    TSlug,
    FindTableByTableTsName<TFullSchema, TTableTsName>['_']['name'],
    TFullSchema,
    TContext,
    FieldsWithFieldName<TFields>,
    TApiRouter
  > {
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
    const endpoints: TApiRouter = config.admin?.endpoints ?? ({} as TApiRouter)
    const defaultEndpoints = getDefaultCollectionAdminApiRouter<
      TSlug,
      TContext,
      FieldsWithFieldName<TFields>
    >(config.slug, config.fields, {
      create: async (args) => {
        // TODO: Access control
        const defaultApi = config.admin?.api?.create ? defaultHandlers.create : (undefined as any)
        const result = await api.create({
          ...args,
          defaultApi,
        })
        return result
      },
      update: async (args) => {
        // TODO: Access control
        const defaultApi = config.admin?.api?.update ? defaultHandlers.update : (undefined as any)
        const result = await api.update({ ...args, defaultApi })
        return result
      },
      delete: async (args) => {
        // TODO: Access control
        const defaultApi = config.admin?.api?.delete ? defaultHandlers.delete : (undefined as any)
        const result = await api.delete({ ...args, defaultApi })
        return result
      },
      findOne: async (args) => {
        // TODO: Access control
        const defaultApi = config.admin?.api?.findOne ? defaultHandlers.findOne : (undefined as any)
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
    })

    return {
      _: {
        table: table as GetTableByTableTsName<TFullSchema, TTableTsName>,
        tableConfig: tableRelationalConfig,
      },
      slug: config.slug,
      fields: config.fields,
      identifierColumn: config.identifierColumn as string,
      admin: {
        endpoints: {
          ...endpoints,
          ...defaultEndpoints,
        },
      },
    }
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
