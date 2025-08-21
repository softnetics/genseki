'use client'
import React, { createContext, use } from 'react'

import type { Fields } from '../../../../../core'
import type { ClientCollectionListViewProps } from '../../../../../core/collection'

export type ListViewPropsContextValue<TFields extends Fields> =
  ClientCollectionListViewProps<TFields>

const ListViewPropsContext = createContext<ListViewPropsContextValue<any>>(null!)

export interface ListViewPropsProviderProps {
  children?: React.ReactNode
  clientListViewProps: ClientCollectionListViewProps<any>
}

/**
 * @description A provider to provide `listViewProps` for client
 */
export function ListViewPropsProvider(props: ListViewPropsProviderProps) {
  return (
    <ListViewPropsContext value={props.clientListViewProps}>{props.children}</ListViewPropsContext>
  )
}

export function useListViewPropsContext<TFields extends Fields>() {
  const value = use(ListViewPropsContext) as ListViewPropsContextValue<TFields>
  if (!value) throw new Error('useListActions must be used within a ListActionsProvider')
  return value
}
