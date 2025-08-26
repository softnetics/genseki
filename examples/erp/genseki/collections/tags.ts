import { CollectionBuilder, createPlugin } from '@genseki/react'

import { columns } from './tags.client'

import { FullModelSchemas } from '../../generated/genseki/unsanitized'
import { builder, context } from '../helper'

export const fields = builder.fields('tag', (fb) => ({
  name: fb.columns('name', {
    type: 'text',
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
          sortBy: ['name'],
          filterBy: ['name'],
        },
      })
    )
    .addPageAndApiRouter(collection.create(fields, {}))
    .addPageAndApiRouter(collection.update(fields, {}))
})
