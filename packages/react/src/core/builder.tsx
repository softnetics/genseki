import {
  type CollectionDefaultAdminApiRouter,
  getCollectionDefaultCreateApiRoute,
  getCollectionDefaultDeleteApiRoute,
  getCollectionDefaultFindManyApiRoute,
  getCollectionDefaultFindOneApiRoute,
  getCollectionDefaultUpdateApiRoute,
  getCollectionDefaultUpdateDefaultApiRoute,
} from './builder.utils'
import type {
  CollectionCreateOptions,
  CollectionDeleteOptions,
  CollectionListOptions,
  CollectionOneOptions,
  CollectionOptions,
  CollectionUpdateOptions,
} from './collection'
import { createGensekiUiRoute, type GensekiPlugin, type GensekiUiRouter } from './config'
import type { AnyContextable, ContextToRequestContext } from './context'
import {
  type ApiRoute,
  type ApiRouteHandlerInitial,
  type ApiRouteSchema,
  type AppendApiPathPrefix,
  appendApiPathPrefix,
} from './endpoint'
import { FieldBuilder, type Fields, type FieldsShape } from './field'
import type { ModelSchemas } from './model'
import { GensekiUiCommonId, type GensekiUiCommonProps } from './ui'

import { CollectionAppLayout, HomeView } from '../react'
import { CreateView } from '../react/views/collections/create'
import { ListView } from '../react/views/collections/list'
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

  collection<const TOptions extends CollectionOptions<TContext, any, any, any, any, any, any, any>>(
    optionsFn: (builder: CollectionBuilder<TContext>) => TOptions
  ): GensekiPlugin<
    TOptions['slug'],
    {
      [K in TOptions['slug']]: AppendApiPathPrefix<`/${TOptions['slug']}`, TOptions['api']> &
        CollectionDefaultAdminApiRouter<
          TOptions['slug'],
          {
            create: TOptions['create']
            update: TOptions['update']
            list: TOptions['list']
            one: TOptions['one']
            delete: TOptions['delete']
          }
        >
    }
  > {
    const builder = new CollectionBuilder<TContext>()
    const options = optionsFn(builder)

    const slug = options.slug

    const api = appendApiPathPrefix(`/${slug}`, options.api ?? {})

    const plugin: GensekiPlugin<
      TOptions['slug'],
      {
        [K in TOptions['slug']]: AppendApiPathPrefix<`/${TOptions['slug']}`, TOptions['api']> &
          CollectionDefaultAdminApiRouter<
            TOptions['slug'],
            {
              create: TOptions['create']
              update: TOptions['update']
              list: TOptions['list']
              one: TOptions['one']
              delete: TOptions['delete']
            }
          >
      }
    > = {
      name: slug,
      plugin: (gensekiOptions) => {
        const previousCollectionHomeRouteIndex = gensekiOptions.uis.findIndex(
          (ui) => ui.id === GensekiUiCommonId.COLLECTION_HOME
        )
        const previousCollectionHomeRoute =
          previousCollectionHomeRouteIndex >= 0
            ? (gensekiOptions.uis[previousCollectionHomeRouteIndex] as GensekiUiRouter<
                GensekiUiCommonProps['COLLECTION_HOME']
              >)
            : undefined

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
              id: GensekiUiCommonId.COLLECTION_HOME,
              context: this.config.context,
              path: `/collections`,
              requiredAuthenticated: true,
              render: (args) => (
                <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                  <HomeView {...args.props} />
                </CollectionAppLayout>
              ),
              props: {
                cards: [{ name: slug, path: `/admin/collections/${slug}` }],
              } satisfies GensekiUiCommonProps[typeof GensekiUiCommonId.COLLECTION_HOME],
            })

        const uis = []

        if (previousCollectionHomeRouteIndex >= 0) {
          gensekiOptions.uis[previousCollectionHomeRouteIndex] = collectionHomeRoute
        } else {
          uis.push(collectionHomeRoute)
        }

        if (options.list) {
          const defaultArgs = {
            slug: slug,
            context: this.config.context,
            identifierColumn: options.list.fields.identifierColumn,
            fields: options.list.fields,
          } satisfies BaseViewProps

          const { route } = getCollectionDefaultFindManyApiRoute({
            slug: slug,
            context: this.config.context,
            schema: this.config.schema,
            fields: options.list.fields,
            customHandler: options.list.api as any,
            listConfiguration: options.list.configuration,
          })

          Object.assign(api, { findMany: route })

          uis.push(
            createGensekiUiRoute({
              path: `/collections/${slug}`,
              requiredAuthenticated: true,
              context: this.config.context,
              render: (args) => {
                return (
                  <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                    <ListView
                      {...args}
                      {...args.params}
                      {...defaultArgs}
                      findMany={route}
                      columns={options.list?.columns ?? []}
                      listConfiguration={options.list?.configuration}
                      features={{
                        create: !!options.create,
                        update: !!options.update,
                        delete: !!options.delete,
                        one: !!options.one,
                      }}
                    />
                  </CollectionAppLayout>
                )
              },
            })
          )
        }

        if (options.create) {
          const defaultArgs = {
            slug: slug,
            context: this.config.context,
            identifierColumn: options.create.fields.identifierColumn,
            fields: options.create.fields,
          } satisfies BaseViewProps

          const { route } = getCollectionDefaultCreateApiRoute({
            slug: slug,
            context: this.config.context,
            schema: this.config.schema,
            fields: options.create.fields,
            customHandler: options.create.api as any,
          })

          Object.assign(api, { create: route })

          uis.push(
            createGensekiUiRoute({
              path: `/collections/${slug}/create`,
              requiredAuthenticated: true,
              context: this.config.context,
              render: (args) => {
                return (
                  <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                    <CreateView {...args} {...args.params} {...defaultArgs} />
                  </CollectionAppLayout>
                )
              },
            })
          )
        }

        if (options.update) {
          const defaultArgs = {
            slug: slug,
            context: this.config.context,
            identifierColumn: options.update.fields.identifierColumn,
            fields: options.update.fields,
          } satisfies BaseViewProps

          const { route: updateRoute } = getCollectionDefaultUpdateApiRoute({
            slug: slug,
            context: this.config.context,
            schema: this.config.schema,
            fields: options.update.fields,
            customHandler: options.update.updateApi as any,
          })

          Object.assign(api, { update: updateRoute })

          const { route: updateDefaultRoute } = getCollectionDefaultUpdateDefaultApiRoute({
            slug: slug,
            context: this.config.context,
            schema: this.config.schema,
            fields: options.update.fields,
            customHandler: options.update.updateDefaultApi as any,
          })

          Object.assign(api, { updateDefault: updateDefaultRoute })

          uis.push(
            createGensekiUiRoute({
              path: `/collections/${slug}/update/:identifier`,
              requiredAuthenticated: true,
              context: this.config.context,
              render: (args) => {
                return (
                  <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                    <UpdateView
                      {...args}
                      {...args.params}
                      {...defaultArgs}
                      identifier={args.params.identifier}
                      updateDefault={updateDefaultRoute}
                    />
                  </CollectionAppLayout>
                )
              },
            })
          )
        }

        if (options.one) {
          const defaultArgs = {
            slug: slug,
            context: this.config.context,
            identifierColumn: options.one.fields.identifierColumn,
            fields: options.one.fields,
          } satisfies BaseViewProps

          const { route } = getCollectionDefaultFindOneApiRoute({
            slug: slug,
            context: this.config.context,
            schema: this.config.schema,
            fields: options.one.fields,
            customHandler: options.one.api as any,
          })
          Object.assign(api, { findOne: route })

          uis.push(
            createGensekiUiRoute({
              path: `/collections/${slug}/:identifier`,
              requiredAuthenticated: true,
              context: this.config.context,
              render: (args) => {
                return (
                  <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                    <OneView
                      {...args}
                      {...args.params}
                      {...defaultArgs}
                      identifier={args.params.identifier}
                      findOne={route}
                    />
                  </CollectionAppLayout>
                )
              },
            })
          )
        }

        if (options.delete) {
          const { route } = getCollectionDefaultDeleteApiRoute({
            slug: slug,
            context: this.config.context,
            schema: this.config.schema,
            fields: options.delete.fields,
            customHandler: options.delete.api as any,
          })
          Object.assign(api, { delete: route })
        }

        return {
          api: {
            [slug]: api,
          } as {
            [K in TOptions['slug']]: AppendApiPathPrefix<`/${TOptions['slug']}`, TOptions['api']> &
              CollectionDefaultAdminApiRouter<
                TOptions['slug'],
                {
                  create: TOptions['create']
                  update: TOptions['update']
                  list: TOptions['list']
                  one: TOptions['one']
                  delete: TOptions['delete']
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
    optionsFn: (fb: FieldBuilder<TContext, TModelSchemas, TModelName>) => TFieldsShape,
    config?: { identifierColumn?: string }
  ) {
    const fb = new FieldBuilder({
      context: this.config.context,
      modelSchemas: this.config.schema,
      modelName: modelName,
    }) as FieldBuilder<TContext, TModelSchemas, TModelName>
    return fb.fields(modelName, optionsFn, config)
  }

  endpoint<const TApiEndpointSchema extends ApiRouteSchema>(
    schema: TApiEndpointSchema,
    handler: ApiRouteHandlerInitial<ContextToRequestContext<TContext>, TApiEndpointSchema>
  ): ApiRoute<TApiEndpointSchema> {
    return {
      schema: schema,
      handler: (payload, { request, response }) => {
        const context = this.config.context.toRequestContext(request)
        return handler(
          { ...payload, context: context as ContextToRequestContext<TContext> },
          { request, response }
        )
      },
    }
  }
}

export class CollectionBuilder<in out TContext extends AnyContextable> {
  constructor() {}

  list<TFields extends Fields>(options: CollectionListOptions<TContext, TFields>) {
    return options
  }
  one<TFields extends Fields>(options: CollectionOneOptions<TContext, TFields>) {
    return options
  }
  create<TFields extends Fields>(options: CollectionCreateOptions<TContext, TFields>) {
    return options
  }
  update<TFields extends Fields>(options: CollectionUpdateOptions<TContext, TFields>) {
    return options
  }
  delete<TFields extends Fields>(options: CollectionDeleteOptions<TContext, TFields>) {
    return options
  }
}
