'use client'

import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import type { BaseData } from '../../../../../core/collection'
import { useTableStatesContext } from '../../../../providers/table'

interface CollectionListTableArgs<TFieldsData extends BaseData> {
  search?: (string | number | symbol)[]
  sortBy?: (string | number | symbol)[]
  total?: number
  data: TFieldsData[]
  columns: ColumnDef<any>[]
}

/**
 * @description A flexible hook for creating collection tables with sorting, pagination and row selection.
 * Provides unopinionated table functionality that can be customized for different collection data structures.
 */
export const useCollectionListTable = <TFieldsData extends BaseData>(
  args: CollectionListTableArgs<TFieldsData>
) => {
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
