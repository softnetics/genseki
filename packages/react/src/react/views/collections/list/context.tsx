'use client'
import React, { createContext, type ReactNode, useContext, useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'

import { Banner } from './banner'
import { CollectionListTableContainer, type CollectionListTableContainerProps } from './container'
import { useCollectionDeleteMutation } from './hooks/use-collection-delete'
import { useCollectionListQuery } from './hooks/use-collection-list'
import { CollectionListTable, type CollectionListTableProps } from './table'
import { CollectionListPagination } from './table/pagination'
import { CollectionListToolbar, type CollectionListToolbarProps } from './toolbar'

import { toast } from '../../../..'
import type { CollectionListActions } from '../../../../core/collection'
import type { FieldsClient } from '../../../../core/field'
import { TableStatesProvider, useTableStatesContext } from '../../../providers/table'
import { useCollection } from '../context'
import type { BaseData } from '../types'

interface CollectionListComponents<T extends BaseData = BaseData> {
  ListBanner: React.FC
  ListTableContainer: React.FC<CollectionListTableContainerProps>
  ListTableToolbar: React.FC<CollectionListToolbarProps>
  ListTable: (props: CollectionListTableProps<T>) => ReactNode
  ListTablePagination: React.FC
}

export interface CollectionListContextValue<T extends BaseData = BaseData> {
  // Should split into another context
  slug: string
  fields: FieldsClient

  // Should split into another context
  params: Record<string, string>
  headers: Record<string, string>
  searchParams: Record<string, string | string[]>

  // Only for list

  components: CollectionListComponents<T>

  isError?: boolean
  isMutating?: boolean
  isQuerying?: boolean

  data: T[]
  total: number

  columns: ColumnDef<T, any>[]
  search?: string[]
  sortBy?: string[]
  filter?: string[]
  actions?: CollectionListActions

  // Helper functions
  deleteRows: () => void
  invalidateList: (page?: number) => Promise<void>
}

const CollectionListContext = createContext<CollectionListContextValue>(null!)

export interface CollectionListProviderProps<T extends BaseData = BaseData> {
  children?: React.ReactNode

  columns: ColumnDef<T, any>[]
  search?: string[]
  sortBy?: string[]
  filter?: string[]
  actions?: CollectionListActions
}

/**
 * @description A provider to provide `listViewProps` for client
 */
function _CollectionListProvider<T extends BaseData>(props: CollectionListProviderProps<T>) {
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

  const components: CollectionListComponents = useMemo(
    () => ({
      ListBanner: () => <Banner slug={context.slug} />,
      ListTable: (props) => <CollectionListTable {...props} />,
      ListTableToolbar: (props) => <CollectionListToolbar {...props} />,
      ListTableContainer: (props) => <CollectionListTableContainer {...props} />,
      ListTablePagination: (props) => <CollectionListPagination {...props} />,
    }),
    [context.slug]
  )

  return (
    <CollectionListContext.Provider
      value={{
        ...rest,
        ...context,
        columns: rest.columns as any,
        isError,
        isQuerying,
        isMutating,
        data,
        total,
        components,
        invalidateList,
        deleteRows,
      }}
    >
      {children}
    </CollectionListContext.Provider>
  )
}

export function CollectionListProvider<T extends BaseData>(props: CollectionListProviderProps<T>) {
  return (
    <TableStatesProvider>
      <_CollectionListProvider<T> {...props} />
    </TableStatesProvider>
  )
}

export function useCollectionList<T extends BaseData>() {
  const value = useContext(CollectionListContext)
  if (!value) {
    throw new Error('"useCollectionList" must be used within a "CollectionListProvider"')
  }
  return value as unknown as CollectionListContextValue<T>
}
