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
import { createGensekiUiRoute, type GensekiPlugin, type GensekiUiRouter } from './config'
import type { AnyContextable, ContextToRequestContext } from './context'
import {
  type AnyApiRouter,
  type ApiRoute,
  type ApiRouteHandlerInitial,
  type ApiRouter,
  type ApiRouteSchema,
  type AppendApiPathPrefix,
  appendApiPathPrefix,
} from './endpoint'
import { FieldBuilder, type Fields, type OptionCallback } from './field'
import { GensekiUiCommonId, type GensekiUiCommonProps } from './ui'
import { appendFieldNameToFields } from './utils'

import { CollectionAppLayout, HomeView } from '../react'
import { CreateView } from '../react/views/collections/create'
import { ListView } from '../react/views/collections/list'
import { OneView } from '../react/views/collections/one'
import type { BaseViewProps } from '../react/views/collections/types'
import { UpdateView } from '../react/views/collections/update'

export class Builder<
  TFullSchema extends Record<string, unknown>,
  in out TContext extends AnyContextable = AnyContextable,
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
    {
      [K in TSlug]: AppendApiPathPrefix<`/${TSlug}`, TApiRouter> &
        CollectionDefaultAdminApiRouter<TSlug, TFields>
    }
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

    const defaultEndpoints = getDefaultCollectionAdminApiRouter(
      this.config.context,
      options.slug,
      options.fields,
      {
        create: async (args) => {
          // TODO: Access control
          const defaultApi = options.admin?.api?.create
            ? defaultHandlers.create
            : (undefined as any)
          const result = await api.create({ ...args, defaultApi } as any)
          return result
        },
        update: async (args) => {
          // TODO: Access control
          const defaultApi = options.admin?.api?.update
            ? defaultHandlers.update
            : (undefined as any)
          const result = await api.update({ ...args, defaultApi } as any)
          return result
        },
        delete: async (args) => {
          // TODO: Access control
          const defaultApi = options.admin?.api?.delete
            ? defaultHandlers.delete
            : (undefined as any)
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
      }
    )

    const transformApis = appendApiPathPrefix(`/${options.slug}`, endpoints)

    const plugin: GensekiPlugin<
      TSlug,
      {
        [K in TSlug]: AppendApiPathPrefix<`/${TSlug}`, TApiRouter> &
          CollectionDefaultAdminApiRouter<TSlug, TFields>
      }
    > = {
      name: options.slug,
      plugin: (gensekiOptions) => {
        const defaultArgs = {
          slug: options.slug,
          context: this.config.context,
          collectionOptions: {
            slug: options.slug,
            identifierColumn: options.identifierColumn,
            fields: options.fields,
          } satisfies BaseViewProps['collectionOptions'],
        }

        const _collectionHomeRoute = gensekiOptions.uis.find(
          (ui) => ui.id === GensekiUiCommonId.COLLECTION_HOME
        ) as GensekiUiRouter<GensekiUiCommonProps['COLLECTION_HOME']> | undefined

        const collectionHomeRoute = _collectionHomeRoute
          ? {
              ..._collectionHomeRoute,
              props: {
                cards: [
                  ...(_collectionHomeRoute.props?.cards ?? []),
                  { name: options.slug, path: `/admin/collections/${options.slug}` },
                ],
              },
            }
          : createGensekiUiRoute({
              id: GensekiUiCommonId.COLLECTION_HOME,
              path: `/collections`,
              requiredAuthenticated: true,
              render: (args) => (
                <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                  <HomeView {...args.props} />
                </CollectionAppLayout>
              ),
              props: {
                cards: [{ name: options.slug, path: `/admin/collections/${options.slug}` }],
              } satisfies GensekiUiCommonProps[typeof GensekiUiCommonId.COLLECTION_HOME],
            })

        const uis = [
          collectionHomeRoute,
          createGensekiUiRoute({
            path: `/collections/${options.slug}`,
            requiredAuthenticated: true,
            render: (args) => (
              <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                <ListView
                  {...args}
                  {...args.params}
                  {...defaultArgs}
                  findMany={defaultEndpoints.findMany}
                />
              </CollectionAppLayout>
            ),
          }),
          createGensekiUiRoute({
            path: `/collections/${options.slug}/:identifier`,
            requiredAuthenticated: true,
            render: (args) => (
              <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                <OneView
                  {...args}
                  {...args.params}
                  {...defaultArgs}
                  identifier={args.params.identifier}
                  findOne={defaultEndpoints.findOne}
                />
              </CollectionAppLayout>
            ),
          }),
          createGensekiUiRoute({
            path: `/collections/${options.slug}/create`,
            requiredAuthenticated: true,
            render: (args) => (
              <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                <CreateView {...args} {...args.params} {...defaultArgs} />
              </CollectionAppLayout>
            ),
          }),
          createGensekiUiRoute({
            path: `/collections/${options.slug}/update/:identifier`,
            requiredAuthenticated: true,
            render: (args) => (
              <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                <UpdateView
                  {...args}
                  {...defaultArgs}
                  identifier={args.params.identifier}
                  findOne={defaultEndpoints.findOne}
                />
              </CollectionAppLayout>
            ),
          }),
        ]

        return {
          api: {
            [options.slug]: {
              ...defaultEndpoints,
              ...transformApis,
            },
          } as {
            [K in TSlug]: AppendApiPathPrefix<`/${TSlug}`, TApiRouter> &
              CollectionDefaultAdminApiRouter<TSlug, TFields>
          },
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
    schema: TApiEndpointSchema,
    handler: ApiRouteHandlerInitial<ContextToRequestContext<TContext>, TApiEndpointSchema>
  ): ApiRoute<TApiEndpointSchema> {
    return {
      schema: schema,
      handler: (payload, request) => {
        const context = this.config.context.toRequestContext(
          request
        ) as ContextToRequestContext<TContext>
        return handler({ ...payload, context: context })
      },
    }
  }

  endpoints<const TApiRouter extends ApiRouter>(endpoints: TApiRouter): Simplify<TApiRouter> {
    return endpoints
  }
}
