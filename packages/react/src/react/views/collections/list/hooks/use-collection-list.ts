import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query'

import type { CollectionListResponse } from '../../../../../core/collection'
import { type UsePagination, usePagination } from '../../../../hooks/use-pagination'
import { type UseSearch, useSearch } from '../../../../hooks/use-search'

export const useCollectionList = <TFieldsData = any>(
  args: { slug: string } & {
    pagination?: UsePagination['Pagination']
    search?: UseSearch['Search']
  }
) => {
  const [pagination] = usePagination()
  const [search] = useSearch()

  const queryKey = { ...(args.pagination || pagination), search: args.search ?? search }

  const query: UseQueryResult<CollectionListResponse<TFieldsData>> = useQuery({
    queryKey: ['GET', `/api/${args.slug}`, { query: queryKey }] as const,
    queryFn: async (context) => {
      const [, , payload] = context.queryKey
      const params = new URLSearchParams([
        ['pageSize', payload.query.pageSize.toString()],
        ['page', payload.query.page.toString()],
      ])

      // Add search parameter if it exists
      if (payload.query.search && payload.query.search.trim()) {
        params.append('search', payload.query.search.trim())
      }

      // Add sorting parameters if they exist
      if (payload.query.sortBy && payload.query.sortOrder) {
        params.append('sortBy', payload.query.sortBy)
        params.append('sortOrder', payload.query.sortOrder)
      }

      return fetch(`/api/${args.slug}?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => data.body)
    },
    placeholderData: keepPreviousData,
  })

  return query
}
