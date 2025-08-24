import z from 'zod'

import { CollectionBuilder, createPlugin } from '@genseki/react'

import { columns } from './users.client'

import { FullModelSchemas } from '../../generated/genseki/unsanitized'
import { builder, context } from '../helper'

export const fields = builder.fields('user', (fb) => ({
  name: fb.columns('name', {
    type: 'text',
  }),
  email: fb.columns('email', {
    type: 'text',
  }),
  image: fb.columns('image', {
    type: 'media',
    label: 'Image',
    isRequired: true,
    uploadOptions: {
      maxSize: 1024 * 1024 * 2, // 2MB
      limit: 1,
      accept: 'image/*',
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      pathName: 'dev-uploads/test', // storage name
    },
  }),
}))

export const usersCollection = createPlugin('users', (app) => {
  const collection = new CollectionBuilder('users', context, FullModelSchemas)

  return app
    .overridePages(collection.overrideHomePage())
    .addApiRouter(collection.listApiRouter(fields))
    .addApiRouter(collection.updateApiRouter(fields))
    .addPageAndApiRouter(
      collection.list(fields, {
        columns: columns,
        configuration: {
          search: ['name'],
          sortBy: ['name'],
          filterBy: ['name', 'email'],
        },
      })
    )
    .addApiRouter({
      example: builder.endpoint(
        {
          method: 'GET',
          path: '/',
          responses: {
            200: z.object({
              data: z.any(),
            }),
          },
        },
        async () => {
          return {
            status: 200,
            body: {
              data: 'Hello from users collection',
            },
          }
        }
      ),
    })
})
