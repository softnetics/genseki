import type React from 'react'

import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

import {
  BackColorExtension,
  CollectionBuilder,
  createPlugin,
  CustomImageExtension,
  ImageUploadNodeExtension,
  SelectionExtension,
} from '@genseki/react'

import { columns, Layout, Page } from './posts.client'

import { FullModelSchemas } from '../../generated/genseki/unsanitized'
import { EditorSlotBefore } from '../editor/slot-before'
import { builder, context, prisma } from '../helper'

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

export const fields = builder.fields('post', (fb) => ({
  example: fb.columns('id', {
    type: 'selectText',
    label: 'Example',
    description: 'This is an example of a select text field',
    options: 'example',
  }),
  title: fb.columns('title', {
    type: 'text',
    label: 'Title',
    description: "Post's title name",
  }),
  content: fb.columns('content', {
    type: 'richText',
    required: true,
    label: 'Food description',
    editor: postEditorProviderProps,
  }),
  author: fb.relations('author', (fb) => ({
    type: 'connect',
    label: 'Author',
    required: true,
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
    updatedAt: fb.columns('updatedAt', {
      type: 'date',
      label: 'Updated At',
      description: 'The date the post was updated',
    }),
    options: 'author',
  })),
  createdAt: fb.columns('createdAt', {
    type: 'date',
    label: 'Created At',
    hidden: true,
    description: 'The date the post was created',
  }),
  postTags: fb.relations('postTags', (fb) => ({
    type: 'create' as const,
    label: 'Tags',
    fields: fb.fields('postTag', (fb) => ({
      remark: fb.columns('remark', {
        type: 'text',
        label: 'Remark',
      }),
      tag: fb.relations('tag', (fb) => ({
        type: 'connect' as const,
        fields: fb.fields('tag', (fb) => ({
          name: fb.columns('name', {
            type: 'text',
            label: 'Name',
          }),
        })),
        options: 'tag',
      })),
    })),
  })),
  updatedAt: fb.columns('updatedAt', {
    type: 'date',
    label: 'Updated At',
    hidden: true,
    description: 'The date the post was updated',
  }),
}))

export const options = builder.options(fields, {
  example: () => {
    return {
      options: [
        {
          label: 'example1',
          value: 'example1',
        },
        {
          label: 'example2',
          value: 'example2',
        },
        {
          label: 'example3',
          value: 'example3',
        },
        {
          label: 'example4',
          value: 'example4',
        },
      ],
    }
  },
  author: async ({ body }) => {
    if (body.title === 'DISABLED') {
      return {
        disabled: true,
        options: [],
      }
    }
    const authors = await prisma.user.findMany({ select: { id: true, name: true } })
    return {
      disabled: false,
      options: authors.map((author) => ({ label: author.name ?? '(No Name)', value: author.id })),
    }
  },
  tag: async () => {
    const tags = await prisma.tag.findMany({ select: { id: true, name: true } })
    return {
      disabled: false,
      options: tags.map((tag) => ({ label: tag.name, value: tag.id })),
    }
  },
})

export const postsCollection = createPlugin('posts', (app) => {
  const collection = new CollectionBuilder('posts', context, FullModelSchemas)

  return app
    .overridePages(collection.overrideHomePage())
    .addPageAndApiRouter(
      collection.list(fields, {
        columns: columns,
        configuration: {
          search: ['title'],
          sortBy: ['updatedAt', 'title'],
          filterBy: ['updatedAt', 'title', 'example'],
        },
        actions: { delete: true, update: true, create: true },
        layout: Layout,
        page: Page,
      })
    )
    .addPageAndApiRouter(collection.create(fields, { options: options }))
    .addPageAndApiRouter(collection.update(fields, { options: options }))
    .addApiRouter(collection.deleteApiRouter(fields))
})

// TODO: THE NEXT SPECIFICATION, INCLUDE RESUABLE LAYOUT
// const x = [
//   app.route('/collections', {
//     middlewares: [],
//     Component: (serverProps: { children }) => <div>Collections</div>,
//     routes: [
//       app.route('', {
//         Component: (serverProps) => <div>List Posts</div>,
//       }),
//       app.route('/posts/create', {
//         Component: (serverProps) => <div>Create Post</div>,
//       }),
//     ],
//   }),

//   app.route('/api', {
//     middlewares: [],
//     routes: [
//       app.GET(
//         '/gay',
//         {
//           query: Z.object(),
//           middlewares: [],
//         },
//         ({ query }) => {}
//       ),

//       builder.endpoint(),

//       app.POST('', {
//         middlewares: [],
//       }),
//     ],
//   }),

//   app.group('A', [
//     app.route('/api', {
//       middlewares: [A],
//       routes: [
//         app.GET('', {
//           middlewares: [],
//         }),
//       ],
//     }),
//   ]),

//   app.group('B', [
//     app.route('/api', {
//       middlewares: [B],
//       routes: [
//         app.POST('', {
//           middlewares: [],
//         }),
//       ],
//     }),
//   ]),

//   collection.list(fields, {}),
// ]

// type RouteSpec =
//   | {
//       Componenet: React.FC
//     }
//   | {
//       GET: () => void
//       POST: () => void
//     }
