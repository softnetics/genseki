import type React from 'react'

import {
  type ListViewPropsContextValue,
  ListViewPropsProvider,
  type ListViewPropsProviderProps,
  useListViewPropsContext,
} from './list-view-props'

import type { Fields } from '../../../../../core'
import {
  TableStatesProvider,
  type TanstackTableContextValue,
  useTableStatesContext,
} from '../../../../providers'

interface CollectionListViewContextValue<TFields extends Fields> {
  tanstackTableContextValue: TanstackTableContextValue
  listViewPropsContextValue: ListViewPropsContextValue<TFields>
}

interface CollectionListViewProviderProps extends ListViewPropsProviderProps {
  children?: React.ReactNode
}
/**
 * @description This provider is a higher levle provider composed 2 providers
 * 1. `TableStatesProvider`
 * 2. `ListViewPropsProvider`
 */
export function CollectionListViewProvider(props: CollectionListViewProviderProps) {
  return (
    <ListViewPropsProvider clientListViewProps={props.clientListViewProps}>
      <TableStatesProvider>{props.children}</TableStatesProvider>
    </ListViewPropsProvider>
  )
}

/**
 * @description This custom hook will let you access 2 providers context
 * 1. `TableStatesContext`
 * 2. `ListViewPropsContext`
 *
 * This is optionally hook, you may use `useTableStatesContext` or `useListViewPropsContext` individually
 */
export function useCollectionListViewContext<
  TFields extends Fields,
>(): CollectionListViewContextValue<TFields> {
  const tanstackTableContextValue = useTableStatesContext()
  const listViewPropsContextValue = useListViewPropsContext<TFields>()

  return {
    listViewPropsContextValue,
    tanstackTableContextValue,
  }
}
