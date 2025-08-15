import React from 'react'

import {
  AppSidebar,
  AppTopbarNav,
  Banner,
  CollectionAppLayout,
  ListView,
  SidebarInset,
  SidebarProvider,
} from '../../react'
import type { BaseViewProps } from '../../react/views/collections/types'
import type { CollectionFindManyApiRoute } from '../builder.utils'
import type { CollectionListConfig, ListViewProps } from '../collection'
import { createGensekiUiRoute, type GensekiPluginOptions } from '../config'
import type { AnyContextable } from '../context'
import { GensekiUiCommonId } from '../ui'

export const generateCustomCollectionListUI = <
  TContext extends AnyContextable,
  TCollectionListConfig extends CollectionListConfig<any, any>,
>(customCollectionArgs: {
  slug: string
  context: TContext
  listConfig: TCollectionListConfig
  gensekiOptions: GensekiPluginOptions
  defaultArgs: BaseViewProps
  route: CollectionFindManyApiRoute<string, any>
  features: {
    create: boolean
    update: boolean
    delete: boolean
    one: boolean
  }
}) => {
  return createGensekiUiRoute({
    id: GensekiUiCommonId.COLLECTION_LIST,
    path: `/collections/${customCollectionArgs.slug}`,
    requiredAuthenticated: true,
    context: customCollectionArgs.context,
    render: (args) => {
      const listViewProps = {
        ...args,
        ...args.params,
        ...customCollectionArgs.defaultArgs,
        findMany: customCollectionArgs.route,
        columns: customCollectionArgs.listConfig.columns ?? [],
        listConfiguration: customCollectionArgs.listConfig.configuration,
        features: customCollectionArgs.features,
      } satisfies ListViewProps

      let GensekiAppLayout = (props: { children: React.ReactNode }) => (
        <CollectionAppLayout
          pathname={args.pathname}
          {...customCollectionArgs.gensekiOptions}
          children={props.children}
        />
      )
      const GensekiCollectionLayout = (props: { children: React.ReactNode }) => props.children
      const GensekiAppTopbarNav = () => <AppTopbarNav />
      const GensekiBanner = () => <Banner slug={customCollectionArgs.slug} />
      let GensekiListView = () => <ListView {...listViewProps} />

      if (!customCollectionArgs.listConfig.uis)
        return (
          <GensekiAppLayout>
            <GensekiAppTopbarNav />
            <GensekiBanner />
            <GensekiListView />
          </GensekiAppLayout>
        )

      if (customCollectionArgs.listConfig.uis.layout?.collection) {
        const newCustomCollectionLayout = customCollectionArgs.listConfig.uis.layout.collection

        GensekiAppLayout = (props: { children: React.ReactNode }) => {
          /**
           * @description
           * 1. At the end of `generateCustomCollectionListUI` we call `GensekiAppLayout` with `children`
           * 2. The `children` is passed down to `newCustomAppLayout` function as a prop
           * 3. The `prop.children` then passed to `newCustomAppLayout` as a children
           * 4. User user `props.children` at the `builder.list` custom config, the it return React.ReactElement from `newCustomAppLayout`
           * 5. the returned React.ReactElement will replace the `GensekiAppLayout`
           * (6.) If user use `VanillaGensekiAppLayout` the children under calling of `VanillaGensekiAppLayout` will be passed to `CollectionAppLayout`
           */
          return newCustomCollectionLayout({
            children: props.children,
            SidebarProvider: (props) => <SidebarProvider {...props} />,
            AppSidebar: () => (
              <AppSidebar pathname={args.pathname} {...customCollectionArgs.gensekiOptions} />
            ),
            SidebarInset: (props) => <SidebarInset {...props} />,
            TopbarNav: () => <GensekiAppTopbarNav />,
            AppLayout(_props) {
              return (
                <CollectionAppLayout
                  pathname={args.pathname}
                  {...customCollectionArgs.gensekiOptions}
                  children={_props.children}
                />
              )
            },
            listViewProps: listViewProps,
          })
        }
      }

      if (customCollectionArgs.listConfig.uis.pages?.collection) {
        const newListView = customCollectionArgs.listConfig.uis.pages?.collection
        GensekiListView = () => {
          return newListView({
            Banner: GensekiBanner,
            ListView: () => <ListView {...listViewProps} />,
            listViewProps: listViewProps,
          })
        }
      }

      return (
        <GensekiAppLayout>
          <GensekiCollectionLayout>
            <GensekiListView />
          </GensekiCollectionLayout>
        </GensekiAppLayout>
      )
    },
  })
}
