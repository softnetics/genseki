import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { z } from 'zod/v4'

import {
  BackColorExtension,
  CustomImageExtension,
  ImageUploadNodeExtension,
  SelectionExtension,
} from '@genseki/react'

import { EditorSlotBefore } from '../editor/slot-before'
import { builder, db } from '../helper'

export const postEditorProviderProps = {
  immediatelyRender: false,
  shouldRerenderOnTransaction: true,
  content: '<h2>This came from Post content field</h2>',
  slotBefore: <EditorSlotBefore />,
  extensions: [
    Color,
    BackColorExtension,
    Underline.configure({ HTMLAttributes: { class: 'earth-underline' } }),
    SelectionExtension,
    TextStyle,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),
    StarterKit.configure({
      bold: { HTMLAttributes: { class: 'bold large-black' } },
      paragraph: { HTMLAttributes: { class: 'paragraph-custom' } },
      heading: { HTMLAttributes: { class: 'heading-custom' } },
      bulletList: { HTMLAttributes: { class: 'list-custom' } },
      orderedList: { HTMLAttributes: { class: 'ordered-list' } },
      code: { HTMLAttributes: { class: 'code' } },
      codeBlock: { HTMLAttributes: { class: 'code-block' } },
      horizontalRule: { HTMLAttributes: { class: 'hr-custom' } },
      italic: { HTMLAttributes: { class: 'italic-text' } },
      strike: { HTMLAttributes: { class: 'strikethrough' } },
      blockquote: { HTMLAttributes: { class: 'blockquote-custom' } },
    }),
    CustomImageExtension.configure({ HTMLAttributes: { className: 'image-displayer' } }),
    ImageUploadNodeExtension.configure({
      showProgress: false,
      accept: 'image/*',
      maxSize: 1024 * 1024 * 10, // 10MB
      limit: 3,
    }),
  ],
}

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
    title: fb.columns('title', {
      type: 'text',
      label: 'Title',
      description: "Post's title name",
    }),
    content: fb.columns('content', {
      type: 'richText',
      isRequired: true,
      label: 'Food description',
      editor: postEditorProviderProps,
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
              type: 'richText',
              label: 'Content',
              description: 'The content of the post',
              editor: postEditorProviderProps,
            }),
          })),
        })),
      })),
      options: builder.options(async () => {
        const result = await db.query.user.findMany({ columns: { id: true, name: true } })
        return result.map((user) => ({ label: user.name, value: user.id }))
      }),
    })),
  })),
})
