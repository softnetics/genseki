'use client'

import { createColumnHelper } from '@tanstack/react-table'

import {
  actionsColumn,
  createDeleteActionItem,
  createEditActionItem,
  createSeparatorItem,
  createViewActionItem,
  type InferFields,
  selectColumn,
} from '@genseki/react'

import type { fields } from './tags'

type Tag = InferFields<typeof fields>
const columnHelper = createColumnHelper<Tag>()

export const columns = [
  selectColumn(),
  columnHelper.accessor('__id', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
  }),
  actionsColumn([
    createViewActionItem(),
    createEditActionItem(),
    createSeparatorItem(),
    createDeleteActionItem(),
  ]),
]
