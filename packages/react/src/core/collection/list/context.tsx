'use client'
import React, { createContext, useContext } from 'react'

import type { ColumnDef } from '@tanstack/react-table'

import {
  Banner,
  CollectionListPagination,
  CollectionListTableContainer,
  type CollectionListTableContainerProps,
  TableStatesProvider,
} from '../../../react'
import type { FieldsClient } from '../../field'
import type { CollectionListActions } from '..'
import { useCollectionContext } from '../context'

export interface CollectionListContextValue {
  // Should split into another context
  slug: string
  fields: FieldsClient

  // Should split into another context
  params: Record<string, string>
  headers: Record<string, string>
  searchParams: Record<string, string | string[]>

  components: {
    ListBanner: React.FC
    ListTableContainer: React.FC<CollectionListTableContainerProps>
    ListTableToolbar: React.FC
    ListTable: React.FC
    ListTablePagination: React.FC
  }

  // Only for list
  columns: ColumnDef<any, any>[]
  search?: string[]
  sortBy?: string[]
  actions?: CollectionListActions
}

const ColectionListContext = createContext<CollectionListContextValue>(null!)

export interface CollectionListProviderProps {
  children?: React.ReactNode

  isPending?: boolean
  isLoading?: boolean

  columns: ColumnDef<any, any>[]
  search?: string[]
  sortBy?: string[]
  actions?: CollectionListActions
}

/**
 * @description A provider to provide `listViewProps` for client
 */
export function CollectionListProvider(props: CollectionListProviderProps) {
  const context = useCollectionContext()

  const { children, ...rest } = props

  return (
    <TableStatesProvider>
      <ColectionListContext.Provider
        value={{
          ...rest,
          ...context,
          components: {
            // TODO: Fix this
            ListBanner: () => <Banner slug={context.slug} />,
            ListTable: () => null,
            ListTableToolbar: () => null,
            ListTableContainer: (props) => <CollectionListTableContainer {...props} />,
            ListTablePagination: (props) => <CollectionListPagination {...props} />,
          },
        }}
      >
        {children}
      </ColectionListContext.Provider>
    </TableStatesProvider>
  )
}

export function useCollectionListContext() {
  const value = useContext(ColectionListContext)
  if (!value) {
    throw new Error('"useCollectionListContext" must be used within a "CollectionListProvider"')
  }
  return value
}
