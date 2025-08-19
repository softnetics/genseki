import React from 'react'

import {
  AppSidebar,
  AppTopbarNav,
  Banner,
  CollectionLayout,
  ListView,
  ListViewWrapper,
  type ListViewWrapperProps,
  SidebarInset,
  SidebarProvider,
} from '../../react'
import type { BaseViewProps, ListFeatures } from '../../react/views/collections/types'
import type { CollectionFindManyApiRoute } from '../builder.utils'
import type { CollectionListConfig, ListViewProps } from '../collection'
import { createGensekiUiRoute, type GensekiPluginOptions } from '../config'
import { GensekiUiCommonId } from '../ui'

export function generateCustomCollectionListUI<
  TCollectionListConfig extends CollectionListConfig<any, any>,
>(
  customCollectionArgs: {
    listConfig: TCollectionListConfig
    gensekiOptions: GensekiPluginOptions
    route: CollectionFindManyApiRoute<string, any>
    features: ListFeatures
  } & BaseViewProps
) {
  return createGensekiUiRoute({
    id: GensekiUiCommonId.COLLECTION_LIST,
    path: `/collections/${customCollectionArgs.slug}`,
    requiredAuthenticated: true,
    context: customCollectionArgs.context,
    render: (args) => {
      const listViewProps = {
        slug: customCollectionArgs.slug,
        identifierColumn: customCollectionArgs.identifierColumn,
        fields: customCollectionArgs.fields,
        context: customCollectionArgs.context,
        pathname: args.pathname,
        headers: args.headers,
        params: args.params,
        searchParams: args.searchParams,
        findMany: customCollectionArgs.route,
        columns: customCollectionArgs.listConfig.columns ?? [],
        listConfiguration: customCollectionArgs.listConfig.configuration,
        features: customCollectionArgs.listConfig.actions,
      } satisfies ListViewProps

      let _CollectionLayout = (props: { children: React.ReactNode }) => (
        <CollectionLayout
          pathname={args.pathname}
          {...customCollectionArgs.gensekiOptions}
          children={props.children}
        />
      )
      const _AppTopbarNav = () => <AppTopbarNav />
      const _Banner = () => <Banner slug={customCollectionArgs.slug} />
      let _ListView = () => <ListView {...listViewProps} />
      const _ListViewWrapper = (props: ListViewWrapperProps) => <ListViewWrapper {...props} />

      if (
        !customCollectionArgs.listConfig.uis?.layout &&
        !customCollectionArgs.listConfig.uis?.pages
      )
        return (
          <_CollectionLayout>
            <_AppTopbarNav />
            <_Banner />
            <_ListViewWrapper>
              <_ListView />
            </_ListViewWrapper>
          </_CollectionLayout>
        )

      if (customCollectionArgs.listConfig.uis.layout?.collection) {
        const newCustomCollectionLayout = customCollectionArgs.listConfig.uis.layout.collection

        _CollectionLayout = (props: { children: React.ReactNode }) => {
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
            CollectionSidebar: () => (
              <AppSidebar pathname={args.pathname} {...customCollectionArgs.gensekiOptions} />
            ),
            SidebarInset: (props) => <SidebarInset {...props} />,
            TopbarNav: () => <_AppTopbarNav />,
            CollectionLayout(_props) {
              return (
                <CollectionLayout
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

        _ListView = () => {
          return newListView({
            Banner: _Banner,
            ListView: () => <ListView {...listViewProps} />,
            ListViewWrapper: _ListViewWrapper,
            listViewProps: listViewProps,
          })
        }
      }

      return (
        <_CollectionLayout>
          <_ListView />
        </_CollectionLayout>
      )
    },
  })
}
