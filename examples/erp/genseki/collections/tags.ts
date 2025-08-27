import { columns } from './tags.client'

import { builder } from '../helper'

export const fields = builder.fields('tag', (fb) => ({
  name: fb.columns('name', {
    type: 'text',
  }),
}))

const list = builder.list(fields, {
  columns: columns,
  configuration: {
    search: ['name'],
    sortBy: ['name'],
  },
  actions: { create: true, update: true, select: true },
})

const update = builder.update(fields, {})
const create = builder.create(fields, {})

export const tagsCollection = builder.collection({
  slug: 'tags',
  list: list,
  create: create,
  update: update,
})
