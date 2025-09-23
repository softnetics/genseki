import { CollectionBuilder, createPlugin } from '@genseki/react'

import { columns } from './tags.client'

import { FullModelSchemas } from '../../generated/genseki/unsanitized'
import { builder, context } from '../helper'

export const fields = builder.fields('tag', (fb) => ({
  name: fb.columns('name', {
    type: 'text',
    required: true,
    default: '',
  }),
  updatedAt: fb.columns('updatedAt', {
    type: 'date',
  }),
}))

export const tagsCollection = createPlugin('tags', (app) => {
  const collection = new CollectionBuilder('tags', context, FullModelSchemas)

  return app
    .overridePages(collection.overrideHomePage())
    .addPageAndApiRouter(
      collection.list(fields, {
        columns: columns,
        configuration: {
          search: ['name'],
          sortBy: [['updatedAt']],
        },
        toolbar: {
          create: true,
          delete: true,
        },
      })
    )
    .addPageAndApiRouter(collection.create(fields, {}))
    .addPageAndApiRouter(collection.update(fields, {}))
    .addPageAndApiRouter(collection.one(fields))
    .addApiRouter(collection.deleteApiRouter(fields))
})
