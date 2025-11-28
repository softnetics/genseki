'use client'
import React, { type Dispatch, type SetStateAction, useMemo, useState } from 'react'

import type { RowSelectionState } from '@tanstack/react-table'

import { createRequiredContext } from '../hooks/internals/create-required-context'
import { usePagination, type UsePaginationReturn } from '../hooks/internals/use-pagination'
import { type UseSort, useSort } from '../hooks/internals/use-sort'
import { useSearch, type UseSearchReturn } from '../hooks/use-search'

interface UseRowSelection {
  RowSelection: RowSelectionState
  SetRowSelection: Dispatch<SetStateAction<RowSelectionState>>
}

export interface TanstackTableContextValue {
  pagination: UsePaginationReturn['pagination']
  setPagination: UsePaginationReturn['setPagination']
  sort: UseSort['Sort']
  setSort: UseSort['SetSort']
  search: UseSearchReturn['search']
  setSearch: UseSearchReturn['setSearch']
  rowSelection: UseRowSelection['RowSelection']
  rowSelectionIds: string[]
  isRowsSelected: boolean
  setRowSelection: UseRowSelection['SetRowSelection']
}
interface TableStatesProviderProps {
  children?: React.ReactNode
}

export const [TableStatesContextProvider, useTableStatesContext] =
  createRequiredContext<TanstackTableContextValue>('TableStatesContext')

export const TableStatesProvider = (props: TableStatesProviderProps) => {
  const { pagination, setPagination } = usePagination()
  const { sort, setSort } = useSort()
  const { search, setSearch } = useSearch()
  // row selection does not maintain a state wih URL search parameter like pagination and search
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const rowSelectionIds = useMemo(
    () => Object.keys(rowSelection).filter((key) => rowSelection[key]),
    [rowSelection]
  )

  const isRowsSelected = rowSelectionIds.length > 0

  return (
    <TableStatesContextProvider
      {...{
        pagination,
        setPagination,
        sort,
        setSort,
        search,
        setSearch,
        rowSelection,
        rowSelectionIds,
        setRowSelection,
        isRowsSelected,
      }}
    >
      {props.children}
    </TableStatesContextProvider>
  )
}
