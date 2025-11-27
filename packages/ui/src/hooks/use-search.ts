'use client'
import { type Dispatch, type SetStateAction } from 'react'

import { type Options, parseAsString, useQueryState } from 'nuqs'

export interface UseSearchReturn {
  setSearch: Dispatch<SetStateAction<string>>
  search: string
}

export function useSearch(options?: Options): UseSearchReturn {
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withOptions({ clearOnDefault: true, ...(options ?? {}) }).withDefault('')
  )

  return { search, setSearch }
}
