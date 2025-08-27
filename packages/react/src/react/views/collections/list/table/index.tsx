'use client'

import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  TanstackTable,
  type TanstackTableProps,
} from '../../../../components/primitives/tanstack-table'
import { useTableStatesContext } from '../../../../providers/table'
import type { BaseData } from '../../types'
import { useCollectionList } from '../context'

interface UseListTableArgs<TFieldsData extends BaseData> {
  sortBy?: (string | number | symbol)[]
  total?: number
  data: TFieldsData[]
  columns: ColumnDef<any>[]
}

/**
 * @description A flexible hook for creating collection tables with sorting, pagination and row selection.
 * Provides unopinionated table functionality that can be customized for different collection data structures.
 */
export function useListTable<TFieldsData extends BaseData>(args: UseListTableArgs<TFieldsData>) {
  const { pagination, setPagination, rowSelection, setRowSelection, sort, setSort } =
    useTableStatesContext()
  // Get default sort field from configuration
  const defaultSortField = (() => {
    if (args.sortBy && args.sortBy.length > 0) {
      return args.sortBy[0].toString()
    }
    return undefined
  })()

  const table = useReactTable({
    data: args.data,
    columns: args.columns,
    enableMultiRowSelection: true,
    getRowId: (row) => row.__id.toString(),
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater
      setRowSelection(newSelection)
    },
    getCoreRowModel: getCoreRowModel(),
    // Sorting settings
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      ...(defaultSortField ? { sorting: [{ id: defaultSortField, desc: true }] } : {}),
    },
    onSortingChange: setSort,
    // Pagination settings
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    rowCount: args.total ?? 0,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function'
          ? updater({ pageIndex: pagination.page - 1, pageSize: pagination.pageSize })
          : updater
      setPagination((prevPagination) => ({
        pageSize: prevPagination.pageSize,
        page: newPagination.pageIndex + 1,
      }))
    },
    state: {
      rowSelection,
      sorting: sort,
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
    },
  })

  return table
}

export interface CollectionListTableProps<T extends BaseData>
  extends Omit<TanstackTableProps<T>, 'table' | 'configuration'> {
  total?: number
  data?: T[]
  columns?: ColumnDef<T, any>[]
  sortBy?: string[]

  isLoading?: boolean
  isError?: boolean
}

export function CollectionListTable<T extends BaseData>(props: CollectionListTableProps<T>) {
  const context = useCollectionList()

  const table = useListTable({
    total: props.total ?? context.total,
    data: props.data ?? context.data ?? [],
    columns: props.columns ?? context.columns,
    sortBy: props.sortBy ?? context.sortBy,
  })

  return (
    <TanstackTable
      table={table}
      loadingItems={table.getTotalSize()}
      className="static"
      onRowClick="toggleSelect"
      isLoading={props.isLoading ?? context.isQuerying ?? context.isMutating}
      isError={props.isError ?? context.isError}
      configuration={{
        sortBy: props.sortBy ?? context.sortBy,
      }}
      {...props}
    />
  )
}
