import type { PropsWithChildren, ReactNode } from 'react'

import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig,
  type ExtractTablesWithRelations,
  is,
  Table,
} from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { Simplify } from 'type-fest'

import { createDefaultApiHandlers } from './builder.handler'
import {
  type CollectionConfig,
  type GetAllTableTsNames,
  getDefaultCollectionAdminApiRouter,
} from './collection'
import type { AnyContextable } from './context'
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

import { CreateView } from '../react/views/collections/create'
import { OneView } from '../react/views/collections/one'
import { UpdateView } from '../react/views/collections/update'

interface RenderArgs {
  params: Record<string, string>
  headers: Headers
  searchParams: { [key: string]: string | string[] }
}

// TODO: Fix this type
interface AuthenticatedRenderArgs extends RenderArgs {}

// TODO: Revise this one
export type GensekiUiRouter<TProps extends Record<string, unknown> = Record<string, unknown>> =
  | {
      requiredAuthenticated: true
      id?: string
      path: string
      render: (args: AuthenticatedRenderArgs & TProps) => ReactNode
      props?: TProps
    }
  | {
      requiredAuthenticated: false
      id?: string
      path: string
      render: (args: RenderArgs & TProps) => ReactNode
      props?: TProps
    }

export interface Genseki<
  TName extends string,
  TContext extends AnyContext,
  TEndpoints extends ApiRouter<TContext> = {},
> {
  name: TName
  endpoints: TEndpoints
  uis: GensekiUiRouter[]
}

// TODO: Authentication context
export interface GensekiBuilderArgs {
  layout: (props: PropsWithChildren) => ReactNode
}

export type GensekiBuilder<
  TName extends string,
  TContext extends AnyContext,
  TEndpoints extends ApiRouter<TContext> = {},
> = (config: GensekiBuilderArgs) => Genseki<TName, TContext, TEndpoints>

export class Builder<
  TFullSchema extends Record<string, unknown>,
  TContext extends AnyContextable = AnyContextable,
> {
  private readonly tableRelationalConfigByTableTsName: ExtractTablesWithRelations<TFullSchema>
  private readonly tableTsNameByTableDbName: Record<string, string>

  constructor(private readonly config: { db: NodePgDatabase<TFullSchema>; schema: TFullSchema }) {
    const tablesConfig = extractTablesRelationalConfig(
      this.config.schema,
      createTableRelationsHelpers
    )

    this.tableRelationalConfigByTableTsName =
      tablesConfig.tables as ExtractTablesWithRelations<TFullSchema>
    this.tableTsNameByTableDbName = tablesConfig.tableNamesMap
  }

  $context<TContext extends AnyContextable>(): Builder<TFullSchema, TContext> {
    return new Builder<TFullSchema, TContext>({ db: this.config.db, schema: this.config.schema })
  }

  collection<
    const TSlug extends string = string,
    const TTableTsName extends GetAllTableTsNames<TFullSchema> = GetAllTableTsNames<TFullSchema>,
    const TFields extends Fields<TFullSchema, TContext> = Fields<TFullSchema, TContext>,
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
  ): GensekiBuilder<TSlug, TContext, TApiRouter> {
    const table = this.config.schema[tableTsName]

    if (!is(table, Table)) {
      throw new Error(`Table ${tableTsName as string} not found`)
    }

    const defaultHandlers = createDefaultApiHandlers({
      db: this.config.db,
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
        const result = await api.create({ ...args, defaultApi })
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

    return (setting) => {
      const Layout = setting.layout

      const uiRouters: GensekiUiRouter[] = [
        {
          path: `/collections/${config.slug}`,
          requiredAuthenticated: true,
          render: (args) => (
            <Layout>
              <ListView {...args} {...args.params} />
            </Layout>
          ),
        },
        {
          path: `/collections/${config.slug}/:identifier`,
          requiredAuthenticated: true,
          render: (args) => (
            <Layout>
              <OneView {...args} {...args.params} />
            </Layout>
          ),
        },
        {
          path: `/collections/${config.slug}`,
          requiredAuthenticated: true,
          render: (args) => (
            <Layout>
              <CreateView {...args} {...args.params} />
            </Layout>
          ),
        },
        {
          path: `/collections/${config.slug}/create`,
          requiredAuthenticated: true,
          render: (args) => (
            <Layout>
              <CreateView {...args} {...args.params} />
            </Layout>
          ),
        },
        {
          path: `/collections/${config.slug}/update/:identifier`,
          requiredAuthenticated: true,
          render: (args) => (
            <Layout>
              <UpdateView {...args} {...args.params} />
            </Layout>
          ),
        },
      ]

      return {
        name: config.slug,
        endpoints: endpoints,
        uis: uiRouters,
      }
    }
  }

  fields<
    TTableTsName extends GetAllTableTsNames<TFullSchema>,
    TFields extends FieldsInitial<TFullSchema, TContext>,
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
