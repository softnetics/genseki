'use client'

import { createColumnHelper } from '@tanstack/react-table'

import type { InferFields } from '@genseki/react'

import type { fields } from './posts'

type Post = InferFields<typeof fields>
const columnHelper = createColumnHelper<Post>()

export const columns = [
  columnHelper.accessor('__id', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('author.email', {
    cell: (info) => info.getValue(),
  }),
]
