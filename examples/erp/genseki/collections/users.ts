import z from 'zod'

import { columns } from './users.client'

import { builder } from '../helper'

export const fields = builder.fields('user', (fb) => ({
  name: fb.columns('name', {
    type: 'text',
  }),
  email: fb.columns('email', {
    type: 'text',
  }),
  image: fb.columns('image', {
    type: 'media',
    label: 'Thumbnail',
    isRequired: true,
    uploadOptions: {
      maxSize: 1024 * 1024 * 2, // 2MB
      limit: 1,
      accept: 'image/*',
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      pathName: 'dev-uploads/test',
    },
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

const api = {
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
}

export const usersCollection = builder.collection({
  slug: 'users',
  list: list,
  api: api,
  update: update,
})
