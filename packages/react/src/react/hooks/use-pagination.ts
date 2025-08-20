'use client'
import type { Dispatch, SetStateAction } from 'react'

import { parseAsInteger, useQueryStates } from 'nuqs'

export interface PaginationValue {
  page: number
  pageSize: number
}

export interface UsePagination {
  Pagination: PaginationValue
  SetPagination: Dispatch<SetStateAction<PaginationValue>>
}

/**
 * @description Handle standard pagination data
 */
export function usePagination() {
  const [pagination, setPagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
  })

  return { pagination, setPagination } as const
}
