import { builder } from '../helper'

export const categoriesCollection = builder.collection('categories', {
  slug: 'categories',
  primaryField: 'id',
  fields: builder.fields('categories', (fb) => ({
    id: fb.columns('id', {
      type: 'text',
    }),
    name: fb.columns('name', {
      type: 'text',
    }),
    posts: fb.relations('posts', (fb) => ({
      type: 'connect',
      fields: fb.fields('posts', (fb) => ({
        id: fb.columns('id', {
          type: 'text',
        }),
        title: fb.columns('title', {
          type: 'text',
        }),
        content: fb.columns('content', {
          type: 'text',
        }),
      })),
      options: builder.options(async ({ db }) => {
        const result = await db.query.users.findMany({ columns: { id: true, name: true } })
        return result.map((user) => ({ label: user.name ?? user.id, value: user.id }))
      }),
    })),
    tags: fb.relations('tags', (fb) => ({
      type: 'create',
      fields: fb.fields('categoryTags', (fb) => ({
        id: fb.columns('id', {
          type: 'text',
        }),
        name: fb.columns('name', {
          type: 'text',
        }),
      })),
    })),
  })),
})
