import React from 'react'

import {
  AppSidebar,
  AppTopbarNav as _AppTopbarNav,
  Banner,
  CollectionLayout as _CollectionLayout,
  CollectionListView as _CollectionListView,
  CollectionListViewProvider,
  ListViewContainer,
  type ListViewContainerProps,
  SidebarInset,
  SidebarProvider,
} from '../../react'
import type { BaseViewProps, ListActions } from '../../react/views/collections/types'
import type { CollectionFindManyApiRoute } from '../builder.utils'
import type { CollectionListConfig, CollectionListViewProps } from '../collection'
import { createGensekiUiRoute, type GensekiPluginOptions, getClientListViewProps } from '../config'

export function generateCustomCollectionListUI<
  TCollectionListConfig extends CollectionListConfig<any, any>,
>(
  customCollectionArgs: {
    listConfig: TCollectionListConfig
    gensekiOptions: GensekiPluginOptions
    route: CollectionFindManyApiRoute<string, any>
    features: ListActions
  } & BaseViewProps
) {
  return createGensekiUiRoute({
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
        actions: customCollectionArgs.listConfig.actions,
      } satisfies CollectionListViewProps
      const AppTopbarNav = () => <_AppTopbarNav />
      const _Banner = () => <Banner slug={customCollectionArgs.slug} />
      const _ListViewContainer = (props: ListViewContainerProps) => <ListViewContainer {...props} />
      const CollectionLayout = (props: { children?: React.ReactNode }) => {
        const NewCollectionLayout = customCollectionArgs.listConfig.uis?.layout

        if (NewCollectionLayout) {
          return (
            <NewCollectionLayout
              SidebarProvider={(props) => <SidebarProvider {...props} />}
              CollectionSidebar={() => (
                <AppSidebar pathname={args.pathname} {...customCollectionArgs.gensekiOptions} />
              )}
              SidebarInset={(props) => <SidebarInset {...props} />}
              TopbarNav={() => <AppTopbarNav />}
              CollectionLayout={(_props) => (
                <_CollectionLayout
                  pathname={args.pathname}
                  {...customCollectionArgs.gensekiOptions}
                  children={_props.children}
                />
              )}
              listViewProps={listViewProps}
            >
              {props.children}
            </NewCollectionLayout>
          )
        }

        return (
          <_CollectionLayout
            pathname={args.pathname}
            {...customCollectionArgs.gensekiOptions}
            children={props.children}
          />
        )
      }
      const ListView = () => {
        const NewListView = customCollectionArgs.listConfig.uis?.page
        const clientListViewProps = getClientListViewProps(listViewProps)

        if (NewListView) {
          return (
            <CollectionListViewProvider clientListViewProps={clientListViewProps}>
              <NewListView
                Banner={_Banner}
                ListView={() => <_CollectionListView />}
                ListViewContainer={_ListViewContainer}
                listViewProps={listViewProps}
              />
            </CollectionListViewProvider>
          )
        }

        return (
          <CollectionListViewProvider clientListViewProps={clientListViewProps}>
            <_CollectionListView />
          </CollectionListViewProvider>
        )
      }

      if (
        !customCollectionArgs.listConfig.uis?.layout &&
        !customCollectionArgs.listConfig.uis?.page
      ) {
        return (
          <CollectionLayout>
            <AppTopbarNav />
            <_Banner />
            <_ListViewContainer>
              <ListView />
            </_ListViewContainer>
          </CollectionLayout>
        )
      }

      return (
        <CollectionLayout>
          <ListView />
        </CollectionLayout>
      )
    },
  })
}
