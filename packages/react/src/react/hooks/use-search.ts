'use client'
import { type Dispatch, type SetStateAction, useState } from 'react'

import { type Options, parseAsString, useQueryState } from 'nuqs'

import { useDebounce } from './use-debounce'

export interface UseSearchReturn {
  debouncedSearch: string
  setSearch: Dispatch<SetStateAction<string>>
  search: string
}

export function useSearch(options?: { debounce?: number } & Options): UseSearchReturn {
  const { debounce, ...nuqsOptions } = options || {}

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useQueryState(
    'search',
    parseAsString.withOptions({ clearOnDefault: true, ...nuqsOptions }).withDefault('')
  )

  const onSearchChange = async (value: string) => {
    setDebouncedSearch(value)
  }

  useDebounce(search, onSearchChange, debounce || 500)

  return { debouncedSearch, search, setSearch }
}
