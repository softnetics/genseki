import type React from 'react'
import type { PropsWithChildren } from 'react'

import type { ColumnDef } from '@tanstack/react-table'
import type { ConditionalExcept, Promisable, Simplify } from 'type-fest'
import type { UndefinedToOptional } from 'type-fest/source/internal'
import type { ZodObject, ZodOptional, ZodType } from 'zod'

import {
  type CollectionLayoutProps,
  CreateView,
  DefaultCollectionLayout,
  HomeView,
  OneView,
  UpdateView,
} from '../../react'
import { getHeadersObject } from '../../react/utils/headers'
import { CollectionProvider } from '../../react/views/collections/context'
import { CollectionListProvider } from '../../react/views/collections/list/context'
import { DefaultCollectionListPage } from '../../react/views/collections/list/default'
import type { BaseViewProps } from '../../react/views/collections/types'
import {
  type CollectionCreateApiRoute,
  type CollectionDeleteApiRoute,
  type CollectionFindOneApiRoute,
  type CollectionListApiRoute,
  type CollectionUpdateApiRoute,
  type CollectionUpdateDefaultApiRoute,
  getCollectionDefaultCreateApiRoute,
  getCollectionDefaultDeleteApiRoute,
  getCollectionDefaultFindOneApiRoute,
  getCollectionDefaultListApiRoute,
  getCollectionDefaultUpdateApiRoute,
  getCollectionDefaultUpdateDefaultApiRoute,
  getOptionsRoute,
} from '../builder.utils'
import {
  createGensekiUiRoute,
  type GensekiAppOptions,
  type GensekiUiRouter,
  getFieldsClient,
} from '../config'
import type { AnyContextable, ContextToRequestContext } from '../context'
import {
  type FieldColumnShape,
  type FieldRelationConnectOrCreateShape,
  type FieldRelationConnectShape,
  type FieldRelationCreateShape,
  type FieldRelationShape,
  type FieldRelationShapeBase,
  type Fields,
  type FieldShape,
  type FieldShapeBase,
  type FieldsOptions,
} from '../field'
import type { DataType, InferDataType, ModelSchemas } from '../model'
import type { GensekiPluginBuilderOptions } from '../plugin'
import { GensekiUiCommonId, type GensekiUiCommonProps } from '../ui'

export type ToZodObject<T extends Record<string, any>> = ZodObject<{
  [Key in keyof T]-?: T[Key] extends undefined
    ? ZodOptional<ZodType<NonNullable<T[Key]>>>
    : ZodType<T[Key]>
}>

type SimplifyConditionalExcept<Base, Condition> = Simplify<ConditionalExcept<Base, Condition>>

export const ApiDefaultMethod = {
  CREATE: 'create',
  FIND_ONE: 'findOne',
  FIND_MANY: 'findMany',
  UPDATE: 'update',
  DELETE: 'delete',
} as const
export type ApiDefaultMethod = (typeof ApiDefaultMethod)[keyof typeof ApiDefaultMethod]

export type ApplyFieldProperty<TType, TField extends FieldShapeBase> = TField['hidden'] extends true
  ? never
  : TField['required'] extends false
    ? TType | undefined
    : TType

export type InferUpdateOneRelationFieldShape<
  TFieldShape extends FieldRelationShapeBase,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = Simplify<
  ('create' extends TKeys
    ? {
        create: TFieldShape extends FieldRelationCreateShape | FieldRelationConnectOrCreateShape
          ? InferUpdateFields<TFieldShape['fields']>
          : never
      }
    : {}) &
    ('connect' extends TKeys
      ? {
          connect: InferDataType<TFieldShape['$server']['relation']['relationDataTypes'][0]>
        }
      : {}) &
    ('disconnect' extends TKeys
      ? {
          disconnect: InferDataType<TFieldShape['$server']['relation']['relationDataTypes'][0]>
        }
      : {})
>

export type InferUpdateManyRelationFieldShape<
  TField extends FieldRelationShapeBase,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = Partial<InferUpdateOneRelationFieldShape<TField, TKeys>>[]

export type InferUpdateRelationField<
  TField extends FieldRelationShapeBase,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = TField['$server']['relation']['isList'] extends true
  ? InferUpdateManyRelationFieldShape<TField, TKeys>
  : Partial<InferUpdateOneRelationFieldShape<TField, TKeys>>

export type InferUpdateFieldShape<TFieldShape extends FieldShape> = ApplyFieldProperty<
  TFieldShape extends FieldRelationShapeBase
    ? TFieldShape extends FieldRelationCreateShape
      ? Simplify<InferUpdateRelationField<TFieldShape, 'create' | 'connect' | 'disconnect'>>
      : TFieldShape extends FieldRelationConnectShape
        ? Simplify<InferUpdateRelationField<TFieldShape, 'connect' | 'disconnect'>>
        : TFieldShape extends FieldRelationConnectOrCreateShape
          ? Simplify<InferUpdateRelationField<TFieldShape, 'create' | 'connect' | 'disconnect'>>
          : never
    : TFieldShape extends FieldColumnShape
      ? TFieldShape['$server']['column']['isList'] extends true
        ? TFieldShape['$server']['column']['isRequired'] extends true
          ? InferDataType<TFieldShape['$server']['column']['dataType']>[]
          : InferDataType<TFieldShape['$server']['column']['dataType']>[] | undefined | null
        : TFieldShape['$server']['column']['isRequired'] extends true
          ? InferDataType<TFieldShape['$server']['column']['dataType']>
          : InferDataType<TFieldShape['$server']['column']['dataType']> | undefined | null
      : never,
  TFieldShape
>

export type InferUpdateFields<TFields extends Fields> = UndefinedToOptional<{
  -readonly [TKey in keyof TFields['shape']]: InferUpdateFieldShape<TFields['shape'][TKey]>
}>

export type InferCreateOneRelationFieldShape<
  TFieldShape extends FieldRelationShapeBase,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = Simplify<
  ('create' extends TKeys
    ? {
        create: TFieldShape extends FieldRelationCreateShape | FieldRelationConnectOrCreateShape
          ? InferCreateFields<TFieldShape['fields']>
          : never
      }
    : {}) &
    ('connect' extends TKeys
      ? {
          connect: InferDataType<TFieldShape['$server']['relation']['relationDataTypes'][0]>
        }
      : {}) &
    ('disconnect' extends TKeys
      ? {
          disconnect: InferDataType<TFieldShape['$server']['relation']['relationDataTypes'][0]>
        }
      : {})
>

export type InferCreateManyRelationFieldShape<
  TField extends FieldRelationShapeBase,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = Partial<InferCreateOneRelationFieldShape<TField, TKeys>>[]

export type InferCreateRelationField<
  TField extends FieldRelationShapeBase,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = TField['$server']['relation']['isList'] extends true
  ? InferCreateManyRelationFieldShape<TField, TKeys>
  : Partial<InferCreateOneRelationFieldShape<TField, TKeys>>

export type InferCreateFieldShape<TFieldShape extends FieldShape> = ApplyFieldProperty<
  TFieldShape extends FieldRelationShapeBase
    ? TFieldShape extends FieldRelationCreateShape
      ? Simplify<InferCreateRelationField<TFieldShape, 'create'>>
      : TFieldShape extends FieldRelationConnectShape
        ? Simplify<InferCreateRelationField<TFieldShape, 'connect'>>
        : TFieldShape extends FieldRelationConnectOrCreateShape
          ? Simplify<InferCreateRelationField<TFieldShape, 'create' | 'connect'>>
          : never
    : TFieldShape extends FieldColumnShape
      ? TFieldShape['$server']['column']['isList'] extends true
        ? TFieldShape['$server']['column']['isRequired'] extends true
          ? InferDataType<TFieldShape['$server']['column']['dataType']>[]
          : InferDataType<TFieldShape['$server']['column']['dataType']>[] | undefined | null
        : TFieldShape['$server']['column']['isRequired'] extends true
          ? InferDataType<TFieldShape['$server']['column']['dataType']>
          : InferDataType<TFieldShape['$server']['column']['dataType']> | undefined | null
      : never,
  TFieldShape
>

export type InferCreateFields<TFields extends Fields> = UndefinedToOptional<{
  -readonly [TShapeKey in keyof TFields['shape']]: InferCreateFieldShape<
    TFields['shape'][TShapeKey]
  >
}>

export type InferRelationField<
  TFieldShape extends FieldRelationShape,
  TKeys extends 'create' | 'connect' | 'disconnect',
> = TFieldShape['$server']['relation']['isList'] extends true
  ? InferCreateManyRelationFieldShape<TFieldShape, TKeys>
  : InferCreateOneRelationFieldShape<TFieldShape, TKeys>

export type InferField<TField extends FieldShapeBase> = TField extends FieldRelationShape
  ? TField['$server']['relation']['isList'] extends true
    ? // TODO: Order field
      TField['$server']['relation']['isRequired'] extends true
      ? _InferFields<TField['fields']>[]
      : _InferFields<TField['fields']>[] | undefined | null
    : TField['$server']['relation']['isRequired'] extends true
      ? _InferFields<TField['fields']>
      : _InferFields<TField['fields']> | undefined | null
  : TField extends FieldColumnShape
    ? TField['$server']['column']['isList'] extends true
      ? TField['$server']['column']['isRequired'] extends true
        ? InferDataType<TField['$server']['column']['dataType']>[]
        : InferDataType<TField['$server']['column']['dataType']>[] | undefined | null
      : TField['$server']['column']['isRequired'] extends true
        ? InferDataType<TField['$server']['column']['dataType']>
        : InferDataType<TField['$server']['column']['dataType']> | undefined | null
    : never

type _InferFields<TFields extends Fields> = SimplifyConditionalExcept<
  {
    -readonly [TKey in keyof TFields['shape']]: TFields['shape'][TKey] extends FieldShapeBase
      ? InferField<TFields['shape'][TKey]>
      : never
  } & { __id: string | number; __pk: string | number },
  never
>

export type InferFields<TFields extends Fields> = UndefinedToOptional<_InferFields<TFields>>

export interface ServerApiHandlerArgs<TContext extends AnyContextable, TFields extends Fields> {
  slug: string
  fields: TFields
  context: ContextToRequestContext<TContext>
}

export type CollectionCreateApiArgs<
  TContext extends AnyContextable,
  TFields extends Fields,
> = ServerApiHandlerArgs<TContext, TFields> & {
  data: InferCreateFields<TFields>
}

export type CollectionCreateApiReturn = {
  __pk: string | number
  __id: string | number
}

export type CollectionCreateApiHandler<TContext extends AnyContextable, TFields extends Fields> = (
  args: CollectionCreateApiArgs<TContext, TFields> & {
    defaultApi: CollectionCreateApiHandler<TContext, TFields>
  }
) => Promisable<CollectionCreateApiReturn>

export type CollectionCreateConfig<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> = {
  api?: CollectionCreateApiHandler<TContext, TFields>
  options?: Simplify<FieldsOptions<TContext, TFields>>
}

export type CollectionFindOneApiArgs<
  TContext extends AnyContextable,
  TFields extends Fields,
> = ServerApiHandlerArgs<TContext, TFields> & {
  // This should be the primary field of the collection e.g. __pk or username
  id: string | number
}

export type CollectionFindOneApiReturn<TFields extends Fields> = InferFields<TFields>

export type CollectionFindOneApiHandler<TContext extends AnyContextable, TFields extends Fields> = (
  args: CollectionFindOneApiArgs<TContext, TFields> & {
    defaultApi: CollectionFindOneApiHandler<TContext, TFields>
  }
) => Promisable<CollectionFindOneApiReturn<TFields>>

export type CollectionListApiArgs<
  TContext extends AnyContextable,
  TFields extends Fields,
> = ServerApiHandlerArgs<TContext, TFields> & {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filter?: string
}

export type CollectionListApiReturn<TFields extends Fields> = {
  data: InferFields<TFields>[]
  total: number
  totalPage: number
  currentPage: number
}

export type CollectionListApiHandler<TContext extends AnyContextable, TFields extends Fields> = (
  args: CollectionListApiArgs<TContext, TFields> & {
    defaultApi: CollectionListApiHandler<TContext, TFields>
  }
) => Promisable<CollectionListApiReturn<TFields>>

export type CollectionListConfig<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
  TFieldsData = any,
> = {
  columns: ColumnDef<TFieldsData, any>[]
  configuration?: ListConfiguration<TFields>
  api?: CollectionListApiHandler<TContext, TFields>
  page?: React.FC
  layout?: React.FC<CollectionLayoutProps>
  /**
   * @param actions will decide whether or not to show actios in `list` view screen, This is not related to available features of collection, but rather only visible UI part of the `list` page
   */
  actions?: {
    create?: boolean
    update?: boolean
    delete?: boolean
    one?: boolean
  }
}

export type CollectionUpdateApiArgs<
  TContext extends AnyContextable,
  TFields extends Fields,
> = ServerApiHandlerArgs<TContext, TFields> & {
  // This should be the primary field of the collection e.g. __pk or username
  id: string | number
  data: InferUpdateFields<TFields>
}

export type CollectionUpdateApiReturn = {
  __pk: string | number
  __id: string | number
}

export type CollectionUpdateApiHandler<TContext extends AnyContextable, TFields extends Fields> = (
  args: CollectionUpdateApiArgs<TContext, TFields> & {
    defaultApi: CollectionUpdateApiHandler<TContext, TFields>
  }
) => Promisable<CollectionUpdateApiReturn>

export type CollectionUpdateDefaultApiArgs<
  TContext extends AnyContextable,
  TFields extends Fields,
> = ServerApiHandlerArgs<TContext, TFields> & {
  // This should be the primary field of the collection e.g. __pk or username
  id: string | number
}

// TODO: This is not correct, it should return default value of form instead of just simple findOne response
export type CollectionUpdateDefaultApiReturn<TFields extends Fields> = any

export type CollectionUpdateDefaultApiHandler<
  TContext extends AnyContextable,
  TFields extends Fields,
> = (
  args: CollectionUpdateDefaultApiArgs<TContext, TFields> & {
    defaultApi: CollectionUpdateDefaultApiHandler<TContext, TFields>
  }
) => Promisable<CollectionUpdateDefaultApiReturn<TFields>>

export type CollectionUpdateConfig<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> = {
  updateApi?: CollectionUpdateApiHandler<TContext, TFields>
  updateDefaultApi?: CollectionUpdateDefaultApiHandler<TContext, TFields>
  options?: Simplify<FieldsOptions<TContext, TFields>>
}

export interface CollectionDeleteApiArgs<TContext extends AnyContextable, TFields extends Fields>
  extends ServerApiHandlerArgs<TContext, TFields> {
  ids: string[] | number[]
}

export type CollectionDeleteApiReturn = {
  success: boolean
}

export type CollectionDeleteApiHandler<TContext extends AnyContextable, TFields extends Fields> = (
  args: CollectionDeleteApiArgs<TContext, TFields> & {
    defaultApi: CollectionDeleteApiHandler<TContext, TFields>
  }
) => Promisable<CollectionDeleteApiReturn>

// Extract searchable columns from fields
export type ExtractSearchableColumns<TFields extends Fields> = {
  [K in keyof TFields['shape']]: TFields['shape'][K] extends FieldColumnShape
    ? TFields['shape'][K]['$client']['column']['dataType'] extends typeof DataType.STRING
      ? Extract<K, string>
      : never
    : never
}[keyof TFields['shape']]

// Extract sortable columns from fields
export type ExtractSortableColumns<TFields extends Fields> = {
  [K in keyof TFields['shape']]: TFields['shape'][K] extends FieldColumnShape
    ? TFields['shape'][K]['$client']['column']['dataType'] extends
        | typeof DataType.STRING
        | typeof DataType.INT
        | typeof DataType.FLOAT
        | typeof DataType.DATETIME
        | typeof DataType.BIGINT
        | typeof DataType.DECIMAL
      ? Extract<K, string>
      : never
    : never
}[keyof TFields['shape']]

export type ExtractFilterableColumns<TFields extends Fields> = {
  [K in keyof TFields['shape']]: TFields['shape'][K] extends FieldColumnShape
    ? TFields['shape'][K]['$client']['column']['dataType'] extends
        | typeof DataType.STRING
        | typeof DataType.INT
        | typeof DataType.FLOAT
        | typeof DataType.DATETIME
        | typeof DataType.BIGINT
        | typeof DataType.DECIMAL
      ? Extract<K, string>
      : never
    : never
}[keyof TFields['shape']]

// ListConfiguration
export interface ListConfiguration<TFields extends Fields> {
  search?: ExtractSearchableColumns<TFields>[]
  sortBy?: ExtractSortableColumns<TFields>[]
  filterBy?: ExtractFilterableColumns<TFields>[]
}

export interface CollectionListResponse {
  data: ({ __id: string | number; __pk: string | number } & Record<string, unknown>)[]
  total: number
  totalPage: number
  currentPage: number
}

export interface CollectionConfig {
  apiPathPrefix: string
  uiPathPrefix: string
}

export class CollectionBuilder<
  TSlug extends string,
  TContext extends AnyContextable,
  TModelSchemas extends ModelSchemas,
  TConfig extends CollectionConfig = { apiPathPrefix: ''; uiPathPrefix: '/collections' },
> {
  constructor(
    private readonly slug: TSlug,
    private readonly context: TContext,
    private readonly schema: TModelSchemas,
    private readonly config: TConfig = {
      uiPathPrefix: '/collections',
      apiPathPrefix: '',
    } as TConfig
  ) {}

  overrideHomePage() {
    return (pages: GensekiUiRouter[], options: GensekiPluginBuilderOptions) => {
      const homePageIndex = pages.findIndex(
        (page) => page.id === GensekiUiCommonId.COLLECTIONS_HOME
      )

      if (homePageIndex === -1) {
        return [
          ...pages,
          createGensekiUiRoute({
            id: GensekiUiCommonId.COLLECTIONS_HOME,
            requiredAuthenticated: true,
            path: `${this.config.uiPathPrefix}`,
            context: this.context,
            render: (args) => {
              return (
                <DefaultCollectionLayout pathname={args.pathname} {...options}>
                  <HomeView {...args.props} />
                </DefaultCollectionLayout>
              )
            },
            props: {
              cards: [{ name: this.slug, path: `/admin${this.config.uiPathPrefix}/${this.slug}` }],
            } satisfies GensekiUiCommonProps[typeof GensekiUiCommonId.COLLECTIONS_HOME],
          }),
        ]
      }

      const homePage: GensekiUiRouter<
        GensekiUiCommonProps[typeof GensekiUiCommonId.COLLECTIONS_HOME]
      > = pages[homePageIndex]

      homePage.props = {
        ...homePage.props,
        cards: [
          ...(homePage.props?.cards ?? []),
          { name: this.slug, path: `/admin${this.config.uiPathPrefix}/${this.slug}` },
        ],
      }

      pages[homePageIndex] = homePage
      return pages
    }
  }

  // TODO: Config
  list<TFields extends Fields>(
    fields: TFields,
    config: CollectionListConfig<TContext, TFields> = { columns: [] }
  ) {
    return (appOptions: GensekiAppOptions) => {
      const route = this.listApiRouter(fields)

      const ui = createGensekiUiRoute({
        path: `${this.config.uiPathPrefix}/${this.slug}`,
        context: this.context,
        requiredAuthenticated: true,
        render: (args) => {
          // Layout
          const CustomLayout = config.layout
          const Layout: React.FC<PropsWithChildren> = (props) => {
            const layoutProps: CollectionLayoutProps = {
              pathname: args.pathname,
              title: appOptions.title,
              version: appOptions.version,
              sidebar: appOptions.sidebar,
              children: props.children,
            }
            if (CustomLayout) return <CustomLayout {...layoutProps} />
            return <DefaultCollectionLayout {...layoutProps} />
          }

          // Page
          const CustomPage = config.page
          const page = CustomPage ? <CustomPage /> : <DefaultCollectionListPage />

          return (
            <CollectionProvider
              slug={this.slug}
              fields={getFieldsClient(fields)}
              params={args.params}
              headers={getHeadersObject(args.headers)}
              searchParams={args.searchParams}
              pathname={args.pathname}
            >
              <CollectionListProvider
                columns={config.columns}
                search={config.configuration?.search}
                sortBy={config.configuration?.sortBy}
                filter={config.configuration?.filterBy}
                actions={config.actions}
              >
                <Layout>{page}</Layout>
              </CollectionListProvider>
            </CollectionProvider>
          )
        },
      })

      return { ui: ui, api: route }
    }
  }

  listApiRouter<TFields extends Fields>(fields: TFields) {
    const { route } = getCollectionDefaultListApiRoute({
      slug: this.slug,
      context: this.context,
      schema: this.schema,
      fields: fields,
    })

    return {
      list: route as Simplify<CollectionListApiRoute<TSlug, TFields>>,
    }
  }

  one<TFields extends Fields>(fields: TFields) {
    return (appOptions: GensekiAppOptions) => {
      const route = this.oneApiRouter(fields)

      const defaultArgs = {
        slug: this.slug,
        context: this.context,
        fields: fields,
      } satisfies BaseViewProps

      const ui = createGensekiUiRoute({
        path: `${this.config.uiPathPrefix}/${this.slug}/:identifier`,
        requiredAuthenticated: true,
        context: this.context,
        render: (args) => {
          return (
            <CollectionProvider
              slug={this.slug}
              fields={getFieldsClient(fields)}
              params={args.params}
              headers={getHeadersObject(args.headers)}
              searchParams={args.searchParams}
              pathname={args.pathname}
            >
              <DefaultCollectionLayout pathname={args.pathname} {...appOptions}>
                <OneView
                  {...args}
                  {...args.params}
                  {...defaultArgs}
                  identifier={args.params.identifier}
                  findOne={route.one as any}
                />
              </DefaultCollectionLayout>
            </CollectionProvider>
          )
        },
      })

      return { ui: ui, api: route }
    }
  }

  oneApiRouter<TFields extends Fields>(fields: TFields) {
    const { route } = getCollectionDefaultFindOneApiRoute({
      slug: this.slug,
      context: this.context,
      schema: this.schema,
      fields: fields,
    })

    return {
      one: route as Simplify<CollectionFindOneApiRoute<TSlug, TFields>>,
    }
  }

  create<TFields extends Fields, TConfig extends CollectionCreateConfig<TContext, TFields>>(
    fields: TFields,
    config: TConfig
  ) {
    return (appOptions: GensekiAppOptions) => {
      const route = this.createApiRouter(fields, config)

      const defaultArgs = {
        slug: this.slug,
        context: this.context,
        fields: fields,
      } satisfies BaseViewProps

      const ui = createGensekiUiRoute({
        path: `${this.config.uiPathPrefix}/${this.slug}/create`,
        requiredAuthenticated: true,
        context: this.context,
        render: (args) => {
          return (
            <CollectionProvider
              slug={this.slug}
              fields={getFieldsClient(fields)}
              params={args.params}
              headers={getHeadersObject(args.headers)}
              searchParams={args.searchParams}
              pathname={args.pathname}
            >
              <DefaultCollectionLayout pathname={args.pathname} {...appOptions}>
                <CreateView {...args} {...args.params} {...defaultArgs} />
              </DefaultCollectionLayout>
            </CollectionProvider>
          )
        },
      })

      return { ui: ui, api: route }
    }
  }

  createApiRouter<
    TFields extends Fields,
    TConfig extends CollectionCreateConfig<TContext, TFields>,
  >(fields: TFields, config: TConfig = {} as TConfig) {
    const { route } = getCollectionDefaultCreateApiRoute({
      slug: this.slug,
      context: this.context,
      schema: this.schema,
      fields: fields,
      customHandler: config.api as any,
    })

    const { route: createOptionsRoute } = getOptionsRoute(
      this.context,
      `/${this.slug}/create/options`,
      config.options ?? {}
    )

    return {
      create: route as Simplify<CollectionCreateApiRoute<TSlug, TFields>>,
      createOptions: createOptionsRoute,
    }
  }

  update<TFields extends Fields, TConfig extends CollectionUpdateConfig<TContext, TFields>>(
    fields: TFields,
    config: TConfig = {} as TConfig
  ) {
    return (appOptions: GensekiAppOptions) => {
      const route = this.updateApiRouter(fields, config)

      const defaultArgs = {
        slug: this.slug,
        context: this.context,
        fields: fields,
      } satisfies BaseViewProps

      const ui = createGensekiUiRoute({
        path: `${this.config.uiPathPrefix}/${this.slug}/update/:identifier`,
        requiredAuthenticated: true,
        context: this.context,
        render: (args) => {
          return (
            <CollectionProvider
              slug={this.slug}
              fields={getFieldsClient(fields)}
              params={args.params}
              headers={getHeadersObject(args.headers)}
              searchParams={args.searchParams}
              pathname={args.pathname}
            >
              <DefaultCollectionLayout pathname={args.pathname} {...appOptions}>
                <UpdateView
                  {...args}
                  {...args.params}
                  {...defaultArgs}
                  identifier={args.params.identifier}
                  updateDefault={route.updateDefault}
                />
              </DefaultCollectionLayout>
            </CollectionProvider>
          )
        },
      })

      return { ui: ui, api: route }
    }
  }

  updateApiRouter<
    TFields extends Fields,
    TConfig extends CollectionUpdateConfig<TContext, TFields>,
  >(fields: TFields, config: TConfig = {} as TConfig) {
    const { route: updateRoute } = getCollectionDefaultUpdateApiRoute({
      slug: this.slug,
      context: this.context,
      schema: this.schema,
      fields: fields,
      customHandler: config.updateApi as any,
    })

    const { route: updateDefaultRoute } = getCollectionDefaultUpdateDefaultApiRoute({
      slug: this.slug,
      context: this.context,
      schema: this.schema,
      fields: fields,
      customHandler: config.updateApi as any,
    })

    const { route: updateOptionsRoute } = getOptionsRoute(
      this.context,
      `/${this.slug}/update/options`,
      config.options ?? {}
    )

    return {
      update: updateRoute as Simplify<CollectionUpdateApiRoute<TSlug, TFields>>,
      updateDefault: updateDefaultRoute as Simplify<
        CollectionUpdateDefaultApiRoute<TSlug, TFields>
      >,
      updateOptions: updateOptionsRoute,
    }
  }

  deleteApiRouter<TFields extends Fields>(fields: TFields) {
    const { route } = getCollectionDefaultDeleteApiRoute({
      slug: this.slug,
      context: this.context,
      schema: this.schema,
      fields: fields,
    })

    return {
      delete: route as Simplify<CollectionDeleteApiRoute<TSlug>>,
    }
  }
}

export interface CollectionListActions {
  create?: boolean
  update?: boolean
  delete?: boolean
  one?: boolean
}
