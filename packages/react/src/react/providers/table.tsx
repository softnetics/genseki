'use client'
import React, { createContext, type Dispatch, type SetStateAction, use, useState } from 'react'

import type { RowSelectionState } from '@tanstack/react-table'

import { type UsePagination, usePagination } from '../hooks/use-pagination'
import { type UseSearch, useSearch } from '../hooks/use-search'

interface UseRowSelection {
  RowSelection: RowSelectionState
  SetRowSelection: Dispatch<SetStateAction<RowSelectionState>>
}

export interface TanstackTableContextValue {
  pagination: UsePagination['Pagination']
  setPagination: UsePagination['SetPagination']
  search: UseSearch['Search']
  setSearch: UseSearch['SetSearch']
  rowSelection: UseRowSelection['RowSelection']
  setRowSelection: UseRowSelection['SetRowSelection']
}

export interface TanstackTableProviderProps {
  children?: React.ReactNode
}

const TanstackTableContext = createContext<TanstackTableContextValue>(null!)

export const TanstackTableProvider = (props: TanstackTableProviderProps) => {
  const [pagination, setPagination] = usePagination()
  const [search, _undebouncedSearch, undebouncedSetSearch] = useSearch()
  // row selection does not maintain a state wih URL search parameter like pagination and search
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  return (
    <TanstackTableContext
      value={{
        pagination,
        setPagination,
        search: search,
        setSearch: undebouncedSetSearch,
        rowSelection,
        setRowSelection,
      }}
    >
      {props.children}
    </TanstackTableContext>
  )
}

/**
 * @description Hook to access the Tanstack table context which provides pagination, search, and row selection state
 */
export const useTanstackTableContext = () => {
  const ctx = use(TanstackTableContext)

  if (!ctx) throw new Error('"useTanstackTableContext" must be used within "TanstackTableProvider"')

  return ctx
}
