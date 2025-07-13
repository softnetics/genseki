import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig,
  type ExtractTablesWithRelations,
} from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { Simplify } from 'type-fest'

import { createDefaultApiHandlers } from './builder.handler'
import {
  type CollectionDefaultAdminApiRouter,
  type CollectionOptions,
  type GetAllTableTsNames,
  getDefaultCollectionAdminApiRouter,
} from './collection'
import type { GensekiPlugin, GensekiUiRouter } from './config'
import type { AnyContextable } from './context'
import {
  type AnyApiRouter,
  type ApiRouteHandler,
  type ApiRouter,
  type ApiRouteSchema,
  type ApiRouteWithContext,
  createEndpoint,
} from './endpoint'
import { FieldBuilder, type Fields, type OptionCallback } from './field'
import { appendFieldNameToFields } from './utils'

import { CreateView } from '../react/views/collections/create'
import { ListView } from '../react/views/collections/list'
import { OneView } from '../react/views/collections/one'
import type { BaseViewProps } from '../react/views/collections/types'
import { UpdateView } from '../react/views/collections/update'

export class Builder<
  TFullSchema extends Record<string, unknown>,
  TContext extends AnyContextable = AnyContextable,
> {
  private readonly tableRelationalConfigByTableTsName: ExtractTablesWithRelations<TFullSchema>
  private readonly tableTsNameByTableDbName: Record<string, string>

  constructor(
    private readonly config: {
      db: NodePgDatabase<TFullSchema>
      schema: TFullSchema
      context: TContext
    }
  ) {
    const tablesConfig = extractTablesRelationalConfig(
      this.config.schema,
      createTableRelationsHelpers
    )

    this.tableRelationalConfigByTableTsName =
      tablesConfig.tables as ExtractTablesWithRelations<TFullSchema>
    this.tableTsNameByTableDbName = tablesConfig.tableNamesMap
  }

  collection<
    const TTableTsName extends GetAllTableTsNames<TFullSchema>,
    const TSlug extends string,
    const TFields extends Fields,
    const TApiRouter extends AnyApiRouter = {},
  >(
    tableTsName: TTableTsName,
    options: CollectionOptions<TSlug, TContext, TFields, TApiRouter>
  ): GensekiPlugin<
    TSlug,
    Simplify<TApiRouter & CollectionDefaultAdminApiRouter<TSlug, TContext, TFields>>
  > {
    const defaultHandlers = createDefaultApiHandlers({
      db: this.config.db,
      schema: this.config.schema,
      fields: options.fields,
      tableTsKey: tableTsName,
      identifierColumn: options.identifierColumn as string,
      tables: this.tableRelationalConfigByTableTsName,
      tableNamesMap: this.tableTsNameByTableDbName,
    })

    const api = {
      create: options.admin?.api?.create ?? defaultHandlers.create,
      update: options.admin?.api?.update ?? defaultHandlers.update,
      delete: options.admin?.api?.delete ?? defaultHandlers.delete,
      findOne: options.admin?.api?.findOne ?? defaultHandlers.findOne,
      findMany: options.admin?.api?.findMany ?? defaultHandlers.findMany,
    }

    const endpoints: TApiRouter = options.admin?.endpoints ?? ({} as TApiRouter)

    const defaultEndpoints = getDefaultCollectionAdminApiRouter(options.slug, options.fields, {
      create: async (args) => {
        // TODO: Access control
        const defaultApi = options.admin?.api?.create ? defaultHandlers.create : (undefined as any)
        const result = await api.create({ ...args, defaultApi } as any)
        return result
      },
      update: async (args) => {
        // TODO: Access control
        const defaultApi = options.admin?.api?.update ? defaultHandlers.update : (undefined as any)
        const result = await api.update({ ...args, defaultApi } as any)
        return result
      },
      delete: async (args) => {
        // TODO: Access control
        const defaultApi = options.admin?.api?.delete ? defaultHandlers.delete : (undefined as any)
        const result = await api.delete({ ...args, defaultApi } as any)
        return result
      },
      findOne: async (args) => {
        // TODO: Access control
        const defaultApi = options.admin?.api?.findOne
          ? defaultHandlers.findOne
          : (undefined as any)
        const result = await api.findOne({ ...args, defaultApi } as any)
        return result
      },
      findMany: async (args) => {
        // TODO: Access control
        const defaultApi = options.admin?.api?.findMany
          ? defaultHandlers.findMany
          : (undefined as any)
        const result = await api.findMany({ ...args, defaultApi } as any)
        return result
      },
    })

    const allEndpoints = {
      ...defaultEndpoints,
      ...endpoints,
    }

    // TODO: Add defaultApiType to GensekiPlugin
    const plugin: GensekiPlugin<
      TSlug,
      TApiRouter & CollectionDefaultAdminApiRouter<TSlug, TContext, TFields>
    > = {
      name: options.slug,
      plugin: (gensekiOptions) => {
        const CollectionLayout = gensekiOptions.components.CollectionLayout

        const defaultArgs = {
          slug: options.slug,
          context: this.config.context,
          collectionOptions: {
            slug: options.slug,
            identifierColumn: options.identifierColumn,
            fields: options.fields,
          } satisfies BaseViewProps['collectionOptions'],
        }

        const uis: GensekiUiRouter[] = [
          {
            path: `/collections/${options.slug}`,
            requiredAuthenticated: true,
            render: (args) => (
              <CollectionLayout>
                <ListView
                  {...args}
                  {...args.params}
                  {...defaultArgs}
                  findMany={allEndpoints.findMany}
                />
              </CollectionLayout>
            ),
          },
          {
            path: `/collections/${options.slug}/:identifier`,
            requiredAuthenticated: true,
            render: (args) => (
              <CollectionLayout>
                <OneView
                  {...args}
                  {...args.params}
                  {...defaultArgs}
                  identifier={args.params.identifier}
                  findOne={allEndpoints.findOne}
                />
              </CollectionLayout>
            ),
          },
          {
            path: `/collections/${options.slug}/create`,
            requiredAuthenticated: true,
            render: (args) => (
              <CollectionLayout>
                <CreateView {...args} {...args.params} {...defaultArgs} />
              </CollectionLayout>
            ),
          },
          {
            path: `/collections/${options.slug}/update/:identifier`,
            requiredAuthenticated: true,
            render: (args) => (
              <CollectionLayout>
                <UpdateView
                  {...args}
                  {...args.params}
                  {...defaultArgs}
                  identifier={args.params.identifer}
                  findOne={allEndpoints.findOne}
                />
              </CollectionLayout>
            ),
          },
        ]

        return {
          api: allEndpoints as TApiRouter &
            CollectionDefaultAdminApiRouter<TSlug, TContext, TFields>,
          uis: uis,
        }
      },
    }
    return plugin
  }

  fields<TTableTsName extends GetAllTableTsNames<TFullSchema>, TFields extends Fields>(
    tableTsName: TTableTsName,
    optionsFn: (
      fb: FieldBuilder<TFullSchema, ExtractTablesWithRelations<TFullSchema>, TTableTsName, TContext>
    ) => TFields
  ): Simplify<TFields> {
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
  ): ApiRouteWithContext<TContext, TApiEndpointSchema> {
    return createEndpoint(args, handler)
  }

  endpoints<const TApiRouter extends ApiRouter>(endpoints: TApiRouter): Simplify<TApiRouter> {
    return endpoints
  }
}
