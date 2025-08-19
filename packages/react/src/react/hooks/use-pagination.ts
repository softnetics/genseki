'use client'
import { parseAsArrayOf, parseAsInteger, parseAsJson, useQueryStates } from 'nuqs'
import z from 'zod'

const sortSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
})
export interface UsePaginationProps {
  page: number
  pageSize: number
  sort: z.infer<typeof sortSchema>[]
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
    sort: parseAsArrayOf(parseAsJson(sortSchema.parse))
      .withDefault([])
      .withOptions({ clearOnDefault: true }),
  })

  return [pagination satisfies UsePaginationProps, setPagination] as const
}
