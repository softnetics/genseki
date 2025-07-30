import type { Simplify } from 'type-fest'

import {
  type CollectionDefaultAdminApiRouter,
  getCollectionDefaultCreateApiRoute,
  getCollectionDefaultFindManyApiRoute,
  getCollectionDefaultFindOneApiRoute,
  getCollectionDefaultUpdateApiRoute,
  getCollectionDefaultUpdateDefaultApiRoute,
} from './builder.utils'
import type { CollectionOptions } from './collection'
import { createGensekiUiRoute, type GensekiPlugin, type GensekiUiRouter } from './config'
import type { AnyContextable, ContextToRequestContext } from './context'
import {
  type ApiRoute,
  type ApiRouteHandlerInitial,
  type ApiRouteSchema,
  type AppendApiPathPrefix,
  appendApiPathPrefix,
} from './endpoint'
import { FieldBuilder, type FieldsShape } from './field'
import type { ModelSchemas } from './model'
import { GensekiUiCommonId, type GensekiUiCommonProps } from './ui'
import { appendFieldNameToFields } from './utils'

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
    options: TOptions
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
        const _collectionHomeRoute = gensekiOptions.uis.find(
          (ui) => ui.id === GensekiUiCommonId.COLLECTION_HOME
        ) as GensekiUiRouter<GensekiUiCommonProps['COLLECTION_HOME']> | undefined

        const collectionHomeRoute = _collectionHomeRoute
          ? {
              ..._collectionHomeRoute,
              props: {
                cards: [
                  ...(_collectionHomeRoute.props?.cards ?? []),
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

        const uis = [collectionHomeRoute]

        if (options.list) {
          const defaultArgs = {
            slug: slug,
            context: this.config.context,
            identifierColumn: options.list.identifierColumn,
            fields: options.list.fields,
          } satisfies BaseViewProps

          const { route } = getCollectionDefaultFindManyApiRoute({
            slug: slug,
            identifierColumn: options.list.identifierColumn,
            context: this.config.context,
            schema: this.config.schema,
            fields: options.list.fields,
            customHandler: options.list.api as any,
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
                    <ListView {...args} {...args.params} {...defaultArgs} findMany={route} />
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
            identifierColumn: options.create.identifierColumn,
            fields: options.create.fields,
          } satisfies BaseViewProps

          const { route } = getCollectionDefaultCreateApiRoute({
            slug: slug,
            identifierColumn: options.create.identifierColumn,
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
            identifierColumn: options.update.identifierColumn,
            fields: options.update.fields,
          } satisfies BaseViewProps

          const { route: updateRoute } = getCollectionDefaultUpdateApiRoute({
            slug: slug,
            identifierColumn: options.update.identifierColumn,
            context: this.config.context,
            schema: this.config.schema,
            fields: options.update.fields,
            customHandler: options.update.updateApi as any,
          })

          Object.assign(api, { update: updateRoute })

          const { route: updateDefaultRoute } = getCollectionDefaultUpdateDefaultApiRoute({
            slug: slug,
            identifierColumn: options.update.identifierColumn,
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
            identifierColumn: options.one.identifierColumn,
            fields: options.one.fields,
          } satisfies BaseViewProps

          const { route } = getCollectionDefaultFindOneApiRoute({
            slug: slug,
            identifierColumn: options.one.identifierColumn,
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
    optionsFn: (fb: FieldBuilder<TContext, TModelSchemas, TModelName>) => TFieldsShape
  ): Simplify<{
    shape: TFieldsShape
    config: { prismaModelName: TModelName }
  }> {
    const fb = new FieldBuilder({
      context: this.config.context,
      modelSchemas: this.config.schema,
      modelName: modelName,
    }) as FieldBuilder<TContext, TModelSchemas, TModelName>
    const shape = appendFieldNameToFields(optionsFn(fb))
    return {
      shape,
      config: { prismaModelName: modelName },
    }
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
