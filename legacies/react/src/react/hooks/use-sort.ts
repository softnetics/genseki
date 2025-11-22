import type { Dispatch, SetStateAction } from 'react'

import { parseAsArrayOf, parseAsJson, useQueryState } from 'nuqs'
import z from 'zod'

const sortSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
})

export type SortValue = z.infer<typeof sortSchema>[]

export interface UseSort {
  Sort: SortValue
  SetSort: Dispatch<SetStateAction<SortValue>>
}

export function useSort() {
  const [sort, setSort] = useQueryState(
    'sort',
    parseAsArrayOf(parseAsJson(sortSchema.parse))
      .withDefault([])
      .withOptions({ clearOnDefault: true })
  )

  return { sort, setSort }
}
