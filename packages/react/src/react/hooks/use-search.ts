'use client'
import { useState } from 'react'

import { type Options, parseAsString, useQueryState } from 'nuqs'

import { useDebounce } from './use-debounce'

export interface UseSearch {
  Search: ReturnType<typeof useSearch>['search']
  SetSearch: ReturnType<typeof useSearch>['setSearch']
  UndebouncedSearch: ReturnType<typeof useSearch>['undebouncedSearch']
}

export function useSearch(options?: { debounce?: number } & Options) {
  const { debounce, ...nuqsOptions } = options || {}

  const [undebouncedSearch, undebouncedSetSearch] = useState('')
  const [search, setQuerySearch] = useQueryState(
    'search',
    parseAsString.withOptions({ clearOnDefault: true, ...nuqsOptions }).withDefault('')
  )

  const onSearchChange = async (value: string) => {
    setQuerySearch(value)
  }

  useDebounce(undebouncedSearch, onSearchChange, debounce || 500)

  return { search, undebouncedSearch, setSearch: undebouncedSetSearch } as const
}
