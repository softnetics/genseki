import { builder } from '../helper'

export const postsCollection = builder.collection('posts', {
  slug: 'posts',
  identifierColumn: 'id',
  fields: builder.fields('posts', (fb) => ({
    title: fb.columns('title', {
      type: 'text',
      label: 'Title',
      description: 'The title of the post',
    }),
    content: fb.columns('content', {
      type: 'text',
      label: 'Content',
      description: 'The content of the post',
    }),
    author: fb.relations('author', (fb) => ({
      type: 'connect',
      label: 'Author',
      description: 'The author of the post',
      fields: fb.fields('user', (fb) => ({
        name: fb.columns('name', {
          type: 'text',
          label: 'Name',
          description: 'The name of the author',
        }),
        email: fb.columns('email', {
          type: 'text',
          label: 'Email',
          description: 'The email of the author',
        }),
      })),
      options: builder.options(async ({ db }) => {
        const result = await db.query.user.findMany({ columns: { id: true, name: true } })
        return result.map((user) => ({ label: user.name, value: user.id }))
      }),
    })),
  })),
})
