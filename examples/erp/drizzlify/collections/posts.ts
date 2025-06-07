import { z } from 'zod'

import { builder } from '../helper'

export const postsCollection = builder.collection('posts', {
  slug: 'posts',
  identifierColumn: 'id',
  admin: {
    api: {
      findMany: async (args) => {
        console.log('Custom findMany for posts collection')
        return await args.defaultApi(args)
      },
    },
    endpoints: {
      customOne: builder.endpoint(
        {
          path: '/custom-one',
          method: 'POST',
          body: z.object({
            name: z.string(),
          }),
          responses: {
            200: z.object({
              message: z.string(),
            }),
          },
        },
        async ({ body }) => {
          const name = body.name
          return {
            status: 200 as const,
            body: {
              message: `Hello, ${name}! This is a custom endpoint for posts.`,
            },
          }
        }
      ),
    },
  },
  fields: builder.fields('posts', (fb) => ({
    id: fb.columns('id', {
      type: 'text',
    }),
    title: fb.columns('title', {
      type: 'text',
    }),
    content: fb.columns('content', {
      type: 'text',
    }),
    authorId: fb.relations('author', (fb) => ({
      type: 'connect',
      fields: fb.fields('user', (fb) => ({
        id: fb.columns('id', {
          type: 'text',
        }),
        name: fb.columns('name', {
          type: 'text',
        }),
        email: fb.columns('email', {
          type: 'text',
        }),
      })),
      options: builder.options(async ({ db }) => {
        const result = await db.query.user.findMany({ columns: { id: true, name: true } })
        return result.map((user) => ({ label: user.name, value: user.id }))
      }),
    })),
  })),
})
