import { builder } from '../helper'

const postsField = builder.fields('posts', (fb) => ({
  id: fb.columns('id', {
    type: 'text',
  }),
  title: fb.columns('title', {
    type: 'text',
  }),
  content: fb.columns('content', {
    type: 'text',
  }),
  author: fb.relations('author', {
    type: 'connect',
    options: builder.options(async ({ db }) => {
      const result = await db.query.users.findMany({ columns: { id: true, name: true } })
      return result.map((user) => ({ label: user.name ?? user.id, value: user.id }))
    }),
  }),
}))

export const postsCollection = builder.collection('posts', {
  slug: 'posts',
  primaryField: 'id',
  fields: postsField,
})
