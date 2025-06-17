import StarterKit from '@tiptap/starter-kit'
import { z } from 'zod/v4'

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
      label: 'ID',
      type: 'text',
      create: 'hidden',
      update: 'hidden',
    }),
    title: fb.columns('title', {
      type: 'text',
      label: 'Title',
      description: "Post's title name",
    }),
    content: fb.columns('content', {
      type: 'richText',
      isRequired: true,
      label: 'Food description',
      editorProviderProps: {
        extensions: [StarterKit.configure({})],
        immediatelyRender: false,
        shouldRerenderOnTransaction: true,
        content: '<h2>This came from content field (posts collection)</h2>',
      },
    }),
    authorId: fb.relations('author', (fb) => ({
      type: 'connect',
      label: 'Author',
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
        posts: fb.relations('posts', (fb) => ({
          type: 'create',
          label: 'Posts',
          description: 'Posts written by the author',
          fields: fb.fields('posts', (fb) => ({
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
          })),
        })),
      })),
      options: builder.options(async ({ db }) => {
        const result = await db.query.user.findMany({ columns: { id: true, name: true } })
        return result.map((user) => ({ label: user.name, value: user.id }))
      }),
    })),
  })),
})
