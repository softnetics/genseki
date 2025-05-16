import { builder } from '../helper'

const postsField = builder.fieldsFrom('posts')

export const postsCollection = builder.collection('posts', {
  slug: 'posts',
  primaryField: 'id',
  fields: {
    id: postsField.columns('id', {
      type: 'text',
    }),
    title: postsField.columns('title', {
      type: 'text',
    }),
    content: postsField.columns('content', {
      type: 'text',
    }),
    authorId: postsField.relations('author', {
      type: 'connect',
      options: builder.options(async ({ db }) => {
        const result = await db.query.users.findMany({ columns: { id: true, firstName: true } })
        return result.map((user) => ({ label: user.firstName ?? user.id, value: user.id }))
      }),
    }),
  },
})
