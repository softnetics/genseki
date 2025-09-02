import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query'

import type { CollectionListResponse } from '../../../../../core/collection'
import { useFilter, type UseFilterReturn } from '../../../../hooks/use-filter'
import { usePagination, type UsePaginationReturn } from '../../../../hooks/use-pagination'
import { useSearch, type UseSearchReturn } from '../../../../hooks/use-search'
import { useSort } from '../../../../hooks/use-sort'

export function useCollectionListQuery(
  args: { slug: string } & {
    pagination?: UsePaginationReturn['pagination']
    search?: UseSearchReturn['search']
    filter?: UseFilterReturn['debouncedFilter']
  }
) {
  const { sort } = useSort()
  const { pagination } = usePagination()
  const { search } = useSearch()
  const { filter } = useFilter()

  const queryKey = {
    ...(args.pagination || pagination),
    search: args.search ?? search,
    filter: args.filter ?? filter,
    sort: sort,
  }

  const query: UseQueryResult<CollectionListResponse> = useQuery({
    queryKey: ['GET', `/${args.slug}`, { query: queryKey }] as const,
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

      // Add filter parameter if it exists
      if (payload.query.filter && payload.query.filter.trim()) {
        params.append('filter', payload.query.filter.trim())
      }

      // Add sorting parameters if they exist
      if (payload.query.sort.length > 0) {
        payload.query.sort.forEach((sort) => {
          params.append('sortBy', sort.id)
          params.append('sortOrder', sort.desc ? 'desc' : 'asc')
        })
      }

      return fetch(`/api/${args.slug}?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => data.body)
    },
    placeholderData: keepPreviousData,
  })

  return query
}
