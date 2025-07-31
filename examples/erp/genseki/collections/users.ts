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
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  }),
}))

export const usersCollection = builder.collection((b) => ({
  slug: 'users',
  create: b.create({
    identifierColumn: 'id',
    fields: fields,
  }),
  list: b.list({
    identifierColumn: 'id',
    fields: fields,
    columns: columns,
  }),
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
}))
