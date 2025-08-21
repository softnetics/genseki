'use client'
import React, {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useMemo,
  useState,
} from 'react'

import type { RowSelectionState } from '@tanstack/react-table'

import { useFilter, type UseFilterReturn } from '../hooks/use-filter'
import { usePagination, type UsePaginationReturn } from '../hooks/use-pagination'
import { useSearch, type UseSearchReturn } from '../hooks/use-search'
import { type UseSort, useSort } from '../hooks/use-sort'

interface UseRowSelection {
  RowSelection: RowSelectionState
  SetRowSelection: Dispatch<SetStateAction<RowSelectionState>>
}

export interface TanstackTableContextValue {
  pagination: UsePaginationReturn['pagination']
  setPagination: UsePaginationReturn['setPagination']
  sort: UseSort['Sort']
  setSort: UseSort['SetSort']
  // search: UseSearchReturn['search']
  debouncedSearch: UseSearchReturn['debouncedSearch']
  setSearch: UseSearchReturn['setSearch']
  // filter: UseFilterReturn['filter']
  debouncedFilter: UseFilterReturn['debouncedFilter']
  setFilter: UseFilterReturn['setFilter']
  rowSelection: UseRowSelection['RowSelection']
  rowSelectionIds: string[]
  isRowsSelected: boolean
  setRowSelection: UseRowSelection['SetRowSelection']
}
interface TableStatesProviderProps {
  children?: React.ReactNode
}

const TableStatesContext = createContext<TanstackTableContextValue>(null!)

export const TableStatesProvider = (props: TableStatesProviderProps) => {
  const { pagination, setPagination } = usePagination()
  const { sort, setSort } = useSort()
  const {
    debouncedSearch,
    // search,
    setSearch,
  } = useSearch()
  const {
    debouncedFilter,
    //  filter,
    setFilter,
  } = useFilter()

  // row selection does not maintain a state wih URL search parameter like pagination and search
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const rowSelectionIds = useMemo(
    () => Object.keys(rowSelection).filter((key) => rowSelection[key]),
    [rowSelection]
  )

  const isRowsSelected = rowSelectionIds.length > 0

  return (
    <TableStatesContext
      value={{
        pagination,
        setPagination,
        sort,
        setSort,
        // search,
        debouncedSearch,
        setSearch,
        // filter,
        debouncedFilter,
        setFilter,
        rowSelection,
        rowSelectionIds,
        setRowSelection,
        isRowsSelected,
      }}
    >
      {props.children}
    </TableStatesContext>
  )
}

/**
 * @description Hook to access the Tanstack table context which provides pagination, search, and row selection state
 */
export const useTableStatesContext = () => {
  const ctx = use(TableStatesContext)

  if (!ctx) throw new Error('"useTableStatesContext" must be used within "TableStatesProvider"')

  return ctx
}
