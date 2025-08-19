'use client'
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'

export interface UsePaginationProps {
  page: number
  pageSize: number
  sortBy: string | null
  sortOrder: 'asc' | 'desc' | null
}

export interface UsePagination {
  Pagination: ReturnType<typeof usePagination>['0']
  SetPagination: ReturnType<typeof usePagination>['1']
}

/**
 * @description Handle standard pagination data
 */
export const usePagination = () => {
  const [pagination, setPagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    sortBy: parseAsString,
    sortOrder: parseAsStringLiteral(['asc', 'desc'])
      .withDefault('asc')
      .withOptions({ clearOnDefault: true }),
  })

  return [pagination satisfies UsePaginationProps, setPagination] as const
}
