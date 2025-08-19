'use client'
import { useState } from 'react'

import { type Options, parseAsString, useQueryState } from 'nuqs'

import { useDebounce } from './use-debounce'

export interface UseSearch {
  Search: ReturnType<typeof useSearch>['0']
  SetSearch: ReturnType<typeof useSearch>['2']
}

export const useSearch = (options?: { debounce?: number } & Options) => {
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

  return [search, undebouncedSearch, undebouncedSetSearch] as const
}
