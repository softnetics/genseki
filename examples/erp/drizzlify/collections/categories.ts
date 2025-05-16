import z from 'zod'

import { builder } from '../helper'

const categoriesField = builder.fieldsFrom('categories')
const categoryTagsField = builder.fieldsFrom('categoryTags')

export const categoriesCollection = builder.collection('categories', {
  slug: 'categories',
  primaryField: 'id',
  fields: {
    id: categoriesField.columns('id', {
      type: 'text',
    }),
    name: categoriesField.columns('name', {
      type: 'text',
    }),
    posts: categoriesField.relations('posts', {
      type: 'connect',
      options: builder.options(async ({ db }) => {
        const result = await db.query.users.findMany({ columns: { id: true, firstName: true } })
        return result.map((user) => ({ label: user.firstName ?? user.id, value: user.id }))
      }),
    }),
    tags: categoriesField.relations('tags', {
      type: 'create',
      fields: {
        name: categoryTagsField.columns('name', {
          type: 'text',
        }),
      },
    }),
  },

  admin: {
    endpoints: builder.endpoint(
      {
        path: '/categories',
        method: 'POST',
        body: z.object({}),
        responses: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
      ({ context }) => {}
    ),
  },
})
