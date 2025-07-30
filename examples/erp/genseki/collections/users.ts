import z from 'zod'

import { builder } from '../helper'

const userFields = builder.fields('user', (fb) => ({
  name: fb.columns('name', {
    type: 'text',
  }),
  email: fb.columns('email', {
    type: 'text',
  }),
  image: fb.columns('image', {
    type: 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  }),
}))

export const usersCollection = builder.collection({
  slug: 'users',
  identifierColumn: 'id',
  create: {
    fields: userFields,
  },
  list: {
    fields: userFields,
  },
  api: {
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
  },
})
