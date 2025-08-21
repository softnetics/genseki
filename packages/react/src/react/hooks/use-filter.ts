'use client'
import { type Dispatch, type SetStateAction, useState } from 'react'

import { type Options, parseAsString, useQueryState } from 'nuqs'

import { useDebounce } from './use-debounce'

export interface UseFilterReturn {
  debouncedFilter: string
  filter: string
  setFilter: Dispatch<SetStateAction<string>>
}

export function useFilter(options?: { debounce?: number } & Options): UseFilterReturn {
  const { debounce, ...nuqsOptions } = options || {}

  const [filter, setFilter] = useState('')
  const [debouncedFilter, setDebouncedFilter] = useQueryState(
    'filter',
    parseAsString.withOptions({ clearOnDefault: true, ...nuqsOptions }).withDefault('')
  )

  const onFilterChange = async (value: string) => {
    setDebouncedFilter(value)
  }

  useDebounce(filter, onFilterChange, debounce || 500)

  return { debouncedFilter, filter, setFilter }
}
