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
})

const update = builder.update(fields, {})
const create = builder.create(fields, {})

export const tagsCollection = builder.collection({
  slug: 'tags',
  list: list,
  create: create,
  update: update,
})
