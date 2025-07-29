import type { Simplify } from 'type-fest'

import { type CollectionDefaultAdminApiRouter, createCollectionDefaultApi } from './builder.utils'
import { type CollectionOptions } from './collection'
import { createGensekiUiRoute, type GensekiPlugin, type GensekiUiRouter } from './config'
import type { AnyContextable, ContextToRequestContext } from './context'
import {
  type AnyApiRouter,
  type ApiRoute,
  type ApiRouteHandlerInitial,
  type ApiRouteSchema,
  type AppendApiPathPrefix,
  appendApiPathPrefix,
} from './endpoint'
import { FieldBuilder, type Fields, type FieldsShape } from './field'
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

  collection<
    const TSlug extends string,
    const TFields extends Fields,
    const TApiRouter extends AnyApiRouter = {},
  >(
    slug: TSlug,
    options: CollectionOptions<TContext, TFields, TApiRouter>
  ): GensekiPlugin<
    TSlug,
    {
      [K in TSlug]: AppendApiPathPrefix<`/${TSlug}`, TApiRouter> &
        CollectionDefaultAdminApiRouter<TSlug, TFields>
    }
  > {
    const defaultApi = createCollectionDefaultApi(slug, this.config, options)

    const api = {
      ...defaultApi,
      ...appendApiPathPrefix(`/${slug}`, options.admin?.endpoints ?? {}),
    }

    const plugin: GensekiPlugin<
      TSlug,
      {
        [K in TSlug]: AppendApiPathPrefix<`/${TSlug}`, TApiRouter> &
          CollectionDefaultAdminApiRouter<TSlug, TFields>
      }
    > = {
      name: slug,
      plugin: (gensekiOptions) => {
        const defaultArgs = {
          slug: slug,
          context: this.config.context,
          collectionOptions: {
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

        const uis = [
          collectionHomeRoute,
          createGensekiUiRoute({
            path: `/collections/${slug}`,
            requiredAuthenticated: true,
            context: this.config.context,
            render: (args) => (
              <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                <ListView
                  {...args}
                  {...args.params}
                  {...defaultArgs}
                  // TODO: Fix this
                  findMany={api.findMany as any}
                />
              </CollectionAppLayout>
            ),
          }),
          createGensekiUiRoute({
            path: `/collections/${slug}/:identifier`,
            requiredAuthenticated: true,
            context: this.config.context,
            render: (args) => (
              <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                <OneView
                  {...args}
                  {...args.params}
                  {...defaultArgs}
                  identifier={args.params.identifier}
                  // TODO: Fix this
                  findOne={api.findOne as any}
                />
              </CollectionAppLayout>
            ),
          }),
          createGensekiUiRoute({
            path: `/collections/${slug}/create`,
            requiredAuthenticated: true,
            context: this.config.context,
            render: (args) => (
              <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                <CreateView {...args} {...args.params} {...defaultArgs} />
              </CollectionAppLayout>
            ),
          }),
          createGensekiUiRoute({
            path: `/collections/${slug}/update/:identifier`,
            requiredAuthenticated: true,
            context: this.config.context,
            render: (args) => (
              <CollectionAppLayout pathname={args.pathname} {...gensekiOptions}>
                <UpdateView
                  {...args}
                  {...args.params}
                  {...defaultArgs}
                  identifier={args.params.identifier}
                  findOne={api.findOne as any}
                />
              </CollectionAppLayout>
            ),
          }),
        ]

        return {
          api: {
            [slug]: api,
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
