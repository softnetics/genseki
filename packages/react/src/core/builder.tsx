import {
  type CollectionDefaultAdminApiRouter,
  getCollectionDefaultCreateApiRoute,
  getCollectionDefaultDeleteApiRoute,
  getCollectionDefaultFindManyApiRoute,
  getCollectionDefaultFindOneApiRoute,
  getCollectionDefaultUpdateApiRoute,
  getCollectionDefaultUpdateDefaultApiRoute,
  getOptionsRoute,
} from './builder.utils'
import type {
  CollectionConfig,
  CollectionCreateConfig,
  CollectionDeleteConfig,
  CollectionListConfig,
  CollectionOneConfig,
  CollectionUpdateConfig,
  InferFields,
} from './collection'
import { createGensekiUiRoute, type GensekiPlugin, type GensekiUiRouter } from './config'
import type { AnyContextable, ContextToRequestContext } from './context'
import { generateCustomCollectionListUI } from './custom-collection/custom-list-page'
import {
  type ApiRoute,
  type ApiRouteHandlerInitial,
  type ApiRouteSchema,
  type AppendApiPathPrefix,
  appendApiPathPrefix,
  createEndpoint,
} from './endpoint'
import { FieldBuilder, type Fields, type FieldsOptions, type FieldsShape } from './field'
import type { ModelSchemas } from './model'
import { GensekiUiCommonId, type GensekiUiCommonProps } from './ui'

import { AppTopbarNav, CollectionLayout, HomeView } from '../react'
import { CreateView } from '../react/views/collections/create'
import { OneView } from '../react/views/collections/one'
import type { BaseViewProps } from '../react/views/collections/types'
import { UpdateView } from '../react/views/collections/update'

export class Builder<TModelSchemas extends ModelSchemas, in out TContext extends AnyContextable> {
  constructor(
    private readonly config: {
      schema: TModelSchemas
      context: TContext
    }
  ) {}

  collection<
    TContext extends AnyContextable,
    const TConfig extends CollectionConfig<TContext, any, any, any, any, any, any, any>,
  >(
    config: TConfig
  ): GensekiPlugin<
    TConfig['slug'],
    {
      [K in TConfig['slug']]: AppendApiPathPrefix<`/${TConfig['slug']}`, TConfig['api']> &
        CollectionDefaultAdminApiRouter<
          TConfig['slug'],
          {
            create: TConfig['create']
            update: TConfig['update']
            list: TConfig['list']
            one: TConfig['one']
            delete: TConfig['delete']
          }
        >
    }
  > {
    const slug = config.slug

    const api = appendApiPathPrefix(`/${slug}`, config.api ?? {})

    const plugin: GensekiPlugin<
      TConfig['slug'],
      {
        [K in TConfig['slug']]: AppendApiPathPrefix<`/${TConfig['slug']}`, TConfig['api']> &
          CollectionDefaultAdminApiRouter<
            TConfig['slug'],
            {
              create: TConfig['create']
              update: TConfig['update']
              list: TConfig['list']
              one: TConfig['one']
              delete: TConfig['delete']
            }
          >
      }
    > = {
      name: slug,
      plugin: (gensekiOptions) => {
        const previousCollectionHomeRouteIndex = gensekiOptions.uis.findIndex(
          (ui) => ui.id === GensekiUiCommonId.COLLECTIONS_HOME
        )
        const previousCollectionHomeRoute =
          previousCollectionHomeRouteIndex >= 0
            ? (gensekiOptions.uis[previousCollectionHomeRouteIndex] as GensekiUiRouter<
                GensekiUiCommonProps['COLLECTIONS_HOME']
              >)
            : undefined

        // `collectionHomeRoute` is a page which group every collections
        // If this is the first plugged collection, It will create the `collection home` page case (else)
        const collectionHomeRoute = previousCollectionHomeRoute
          ? {
              ...previousCollectionHomeRoute,
              props: {
                cards: [
                  ...(previousCollectionHomeRoute.props?.cards ?? []),
                  { name: slug, path: `/admin/collections/${slug}` },
                ],
              },
            }
          : createGensekiUiRoute({
              id: GensekiUiCommonId.COLLECTIONS_HOME,
              context: this.config.context,
              path: `/collections`,
              requiredAuthenticated: true,
              render: (args) => (
                <CollectionLayout pathname={args.pathname} {...gensekiOptions}>
                  <AppTopbarNav />
                  <HomeView {...args.props} />
                </CollectionLayout>
              ),
              props: {
                cards: [{ name: slug, path: `/admin/collections/${slug}` }],
              } satisfies GensekiUiCommonProps[typeof GensekiUiCommonId.COLLECTIONS_HOME],
            })

        const uis = []

        if (previousCollectionHomeRouteIndex >= 0) {
          gensekiOptions.uis[previousCollectionHomeRouteIndex] = collectionHomeRoute
        } else {
          uis.push(collectionHomeRoute)
        }

        if (config.list) {
          const { route } = getCollectionDefaultFindManyApiRoute({
            slug: slug,
            context: this.config.context,
            schema: this.config.schema,
            fields: config.list.fields,
            customHandler: config.list.api as any,
            listConfiguration: config.list.configuration,
          })

          Object.assign(api, { findMany: route })

          const listUI = generateCustomCollectionListUI({
            slug: slug,
            context: this.config.context,
            listConfig: config.list,
            gensekiOptions: gensekiOptions,
            identifierColumn: config.list.fields.config.identifierColumn,
            fields: config.list.fields,
            route: route,
            features: {
              create: !!config.create,
              update: !!config.update,
              delete: !!config.delete,
              one: !!config.one,
            },
          })

          uis.push(listUI)
        }

        if (config.create) {
          const defaultArgs = {
            slug: slug,
            context: this.config.context,
            identifierColumn: config.create.fields.config.identifierColumn,
            fields: config.create.fields,
          } satisfies BaseViewProps

          const { route } = getCollectionDefaultCreateApiRoute({
            slug: slug,
            context: this.config.context,
            schema: this.config.schema,
            fields: config.create.fields,
            customHandler: config.create.api as any,
          })

          Object.assign(api, { create: route })

          if ('options' in config.create) {
            const { route } = getOptionsRoute(
              this.config.context,
              `/${config.slug}/create/options`,
              config.create.options as FieldsOptions
            )
            Object.assign(api, { createOptions: route })
          }

          uis.push(
            createGensekiUiRoute({
              path: `/collections/${slug}/create`,
              requiredAuthenticated: true,
              context: this.config.context,
              render: (args) => {
                return (
                  <CollectionLayout pathname={args.pathname} {...gensekiOptions}>
                    <AppTopbarNav />
                    <CreateView {...args} {...args.params} {...defaultArgs} />
                  </CollectionLayout>
                )
              },
            })
          )
        }

        if (config.update) {
          const defaultArgs = {
            slug: slug,
            context: this.config.context,
            identifierColumn: config.update.fields.config.identifierColumn,
            fields: config.update.fields,
          } satisfies BaseViewProps

          const { route: updateRoute } = getCollectionDefaultUpdateApiRoute({
            slug: slug,
            context: this.config.context,
            schema: this.config.schema,
            fields: config.update.fields,
            customHandler: config.update.updateApi as any,
          })

          Object.assign(api, { update: updateRoute })

          if ('options' in config.update) {
            const { route } = getOptionsRoute(
              this.config.context,
              `/${config.slug}/update/options`,
              config.update.options as FieldsOptions
            )
            Object.assign(api, { updateOptions: route })
          }

          const { route: updateDefaultRoute } = getCollectionDefaultUpdateDefaultApiRoute({
            slug: slug,
            context: this.config.context,
            schema: this.config.schema,
            fields: config.update.fields,
            customHandler: config.update.updateDefaultApi as any,
          })

          Object.assign(api, { updateDefault: updateDefaultRoute })

          uis.push(
            createGensekiUiRoute({
              path: `/collections/${slug}/update/:identifier`,
              requiredAuthenticated: true,
              context: this.config.context,
              render: (args) => {
                return (
                  <CollectionLayout pathname={args.pathname} {...gensekiOptions}>
                    <AppTopbarNav />
                    <UpdateView
                      {...args}
                      {...args.params}
                      {...defaultArgs}
                      identifier={args.params.identifier}
                      updateDefault={updateDefaultRoute}
                    />
                  </CollectionLayout>
                )
              },
            })
          )
        }

        if (config.one) {
          const defaultArgs = {
            slug: slug,
            context: this.config.context,
            identifierColumn: config.one.fields.config.identifierColumn,
            fields: config.one.fields,
          } satisfies BaseViewProps

          const { route } = getCollectionDefaultFindOneApiRoute({
            slug: slug,
            context: this.config.context,
            schema: this.config.schema,
            fields: config.one.fields,
            customHandler: config.one.api as any,
          })
          Object.assign(api, { findOne: route })

          uis.push(
            createGensekiUiRoute({
              path: `/collections/${slug}/:identifier`,
              requiredAuthenticated: true,
              context: this.config.context,
              render: (args) => {
                return (
                  <CollectionLayout pathname={args.pathname} {...gensekiOptions}>
                    <AppTopbarNav />
                    <OneView
                      {...args}
                      {...args.params}
                      {...defaultArgs}
                      identifier={args.params.identifier}
                      findOne={route}
                    />
                  </CollectionLayout>
                )
              },
            })
          )
        }

        if (config.delete) {
          const { route } = getCollectionDefaultDeleteApiRoute({
            slug: slug,
            context: this.config.context,
            schema: this.config.schema,
            fields: config.delete.fields,
            customHandler: config.delete.api as any,
          })
          Object.assign(api, { delete: route })
        }

        return {
          api: {
            [slug]: api,
          } as {
            [K in TConfig['slug']]: AppendApiPathPrefix<`/${TConfig['slug']}`, TConfig['api']> &
              CollectionDefaultAdminApiRouter<
                TConfig['slug'],
                {
                  create: TConfig['create']
                  update: TConfig['update']
                  list: TConfig['list']
                  one: TConfig['one']
                  delete: TConfig['delete']
                }
              >
          },
          uis: uis,
        }
      },
    }
    return plugin
  }

  fields<const TModelName extends keyof TModelSchemas, const TFieldsShape extends FieldsShape>(
    modelName: TModelName,
    configFn: (fb: FieldBuilder<TContext, TModelSchemas, TModelName>) => TFieldsShape,
    info?: { identifierColumn?: string }
  ) {
    const fb = new FieldBuilder({
      context: this.config.context,
      modelSchemas: this.config.schema,
      modelName: modelName,
    }) as FieldBuilder<TContext, TModelSchemas, TModelName>
    return fb.fields(modelName, configFn, info)
  }

  endpoint<const TApiEndpointSchema extends ApiRouteSchema>(
    schema: TApiEndpointSchema,
    handler: ApiRouteHandlerInitial<ContextToRequestContext<TContext>, TApiEndpointSchema>
  ): ApiRoute<TApiEndpointSchema> {
    return createEndpoint(this.config.context, schema, handler)
  }

  options<const TFields extends Fields, const TOptions extends FieldsOptions<TContext, TFields>>(
    fields: TFields,
    options: TOptions
  ) {
    return options
  }

  list<
    TFields extends Fields,
    TConfig extends CollectionListConfig<TContext, TFields, InferFields<TFields>>,
  >(
    fields: TFields,
    config: Omit<TConfig, 'fields'>
  ): CollectionListConfig<TContext, TFields, InferFields<TFields>> {
    return { fields, ...config } as unknown as CollectionListConfig<
      TContext,
      TFields,
      InferFields<TFields>
    >
  }
  one<TFields extends Fields, TConfig extends CollectionOneConfig<TContext, TFields>>(
    fields: TFields,
    config: Omit<TConfig, 'fields'>
  ): CollectionOneConfig<TContext, TFields> {
    return { fields, ...config } as unknown as CollectionOneConfig<TContext, TFields>
  }
  create<TFields extends Fields, TConfig extends CollectionCreateConfig<TContext, TFields>>(
    fields: TFields,
    config: Omit<TConfig, 'fields'>
  ): CollectionCreateConfig<TContext, TFields> {
    return { fields, ...config } as unknown as CollectionCreateConfig<TContext, TFields>
  }
  update<TFields extends Fields, TConfig extends CollectionUpdateConfig<TContext, TFields>>(
    fields: TFields,
    config: Omit<TConfig, 'fields'>
  ): CollectionUpdateConfig<TContext, TFields> {
    return { fields, ...config } as unknown as CollectionUpdateConfig<TContext, TFields>
  }
  delete<TFields extends Fields, TConfig extends CollectionDeleteConfig<TContext, TFields>>(
    fields: TFields,
    config: Omit<TConfig, 'fields'>
  ): CollectionDeleteConfig<TContext, TFields> {
    return { fields, ...config } as unknown as CollectionDeleteConfig<TContext, TFields>
  }
}
