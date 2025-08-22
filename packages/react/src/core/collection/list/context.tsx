'use client'
import React, { createContext, type ReactNode, useContext } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'

import {
  Banner,
  CollectionListPagination,
  CollectionListTable,
  CollectionListTableContainer,
  type CollectionListTableContainerProps,
  type CollectionListTableProps,
  CollectionListToolbar,
  type CollectionListToolbarProps,
  TableStatesProvider,
  toast,
  useCollectionDeleteMutation,
  useCollectionListQuery,
  useTableStatesContext,
} from '../../../react'
import type { FieldsClient } from '../../field'
import type { BaseData, CollectionListActions } from '..'
import { useCollection } from '../context'

export interface CollectionListContextValue<T extends BaseData = BaseData> {
  // Should split into another context
  slug: string
  fields: FieldsClient

  // Should split into another context
  params: Record<string, string>
  headers: Record<string, string>
  searchParams: Record<string, string | string[]>

  // Only for list

  components: {
    ListBanner: React.FC
    ListTableContainer: React.FC<CollectionListTableContainerProps>
    ListTableToolbar: React.FC<CollectionListToolbarProps>
    ListTable: (props: CollectionListTableProps<T>) => ReactNode
    ListTablePagination: React.FC
  }

  isError?: boolean
  isMutating?: boolean
  isQuerying?: boolean

  data: T[]
  total: number

  columns: ColumnDef<T, any>[]
  search?: string[]
  sortBy?: string[]
  actions?: CollectionListActions

  // Helper functions
  deleteRows: () => void
  invalidateList: (page?: number) => Promise<void>
}

const ColectionListContext = createContext<CollectionListContextValue>(null!)

export interface CollectionListProviderProps<T extends BaseData = BaseData> {
  children?: React.ReactNode

  columns: ColumnDef<T, any>[]
  search?: string[]
  sortBy?: string[]
  actions?: CollectionListActions
}

/**
 * @description A provider to provide `listViewProps` for client
 */
function _CollectionListProvider(props: CollectionListProviderProps) {
  const context = useCollection()

  const { children, ...rest } = props

  const { rowSelectionIds, setRowSelection } = useTableStatesContext()
  const queryClient = useQueryClient()
  const query = useCollectionListQuery({ slug: context.slug })

  const invalidateList = async (page?: number) => {
    const additionalKeys = page ? [{ query: { page } }] : []
    await queryClient.invalidateQueries({
      queryKey: ['GET', `/${context.slug}`, ...additionalKeys],
      exact: false,
    })
  }

  const deleteMutation = useCollectionDeleteMutation({
    slug: context.slug,
    onSuccess: async () => {
      setRowSelection({})
      invalidateList()
      toast.success('Deletion successfully')
    },
    onError: () => {
      toast.error('Failed to delete items')
    },
  })

  const deleteRows = () => {
    if (rowSelectionIds.length === 0) return
    deleteMutation.mutate(rowSelectionIds)
  }

  const isError = deleteMutation.isError || query.isError
  const isQuerying = query.isLoading
  const isMutating = deleteMutation.isPending

  const data = query.data?.data ?? []
  const total = query.data?.total ?? 0

  return (
    <ColectionListContext.Provider
      value={{
        ...rest,
        ...context,
        isError,
        isQuerying,
        isMutating,
        data,
        total,
        components: {
          ListBanner: () => <Banner slug={context.slug} />,
          ListTable: (props) => <CollectionListTable {...props} />,
          ListTableToolbar: (props) => <CollectionListToolbar {...props} />,
          ListTableContainer: (props) => <CollectionListTableContainer {...props} />,
          ListTablePagination: (props) => <CollectionListPagination {...props} />,
        },
        invalidateList,
        deleteRows,
      }}
    >
      {children}
    </ColectionListContext.Provider>
  )
}

export function CollectionListProvider(props: CollectionListProviderProps) {
  return (
    <TableStatesProvider>
      <_CollectionListProvider {...props} />
    </TableStatesProvider>
  )
}

export function useCollectionList<T extends BaseData>() {
  const value = useContext(ColectionListContext)
  if (!value) {
    throw new Error('"useCollectionList" must be used within a "CollectionListProvider"')
  }
  return value as unknown as CollectionListContextValue<T>
}
