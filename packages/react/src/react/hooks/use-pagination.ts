'use client'
import type { Dispatch, SetStateAction } from 'react'

import { parseAsArrayOf, parseAsInteger, parseAsJson, useQueryStates } from 'nuqs'
import z from 'zod'

const sortSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
})

export interface PaginationValue {
  page: number
  pageSize: number
  sort: z.infer<typeof sortSchema>[]
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
    sort: parseAsArrayOf(parseAsJson(sortSchema.parse))
      .withDefault([])
      .withOptions({ clearOnDefault: true }),
  })

  return { pagination, setPagination } as const
}
