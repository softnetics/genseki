'use client'

import { createColumnHelper } from '@tanstack/react-table'

import { actionsColumn, createEditActionItem, type InferFields } from '@genseki/react'

import type { fields } from './users'

type User = InferFields<typeof fields>
const columnHelper = createColumnHelper<User>()

export const columns = [
  columnHelper.accessor('__id', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    cell: (info) => info.getValue(),
  }),
  actionsColumn([createEditActionItem()]),
]
