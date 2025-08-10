import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

import {
  BackColorExtension,
  CustomImageExtension,
  ImageUploadNodeExtension,
  SelectionExtension,
} from '@genseki/react'

import { columns } from './posts.client'

import { EditorSlotBefore } from '../editor/slot-before'
import { builder } from '../helper'

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
  updatedAt: fb.columns('updatedAt', {
    type: 'date',
    label: 'Updated At',
    hidden: true,
    description: 'The date the post was updated',
  }),
}))

export const options = builder.options(fields, {
  author: async ({ body }) => {
    if (body.title === 'NAME') {
      return {
        disabled: false,
        options: [{ label: 'Author Name', value: 'author_id' }],
      }
    }
    return {
      disabled: true,
      options: [{ label: 'Author Name', value: 'author_id' }],
    }
  },
})

const list = builder.list(fields, {
  columns: columns,
  configuration: {
    search: ['title'],
    sortBy: ['updatedAt', 'title'],
  },
  options: options,
})

const create = builder.create(fields, {
  options: options,
})

const update = builder.update(fields, {
  options: options,
})

const _delete = builder.delete(fields, {
  options: options,
})

const one = builder.one(fields, {
  options: options,
})

export const postsCollection = builder.collection({
  slug: 'posts',
  list: list,
  create: create,
  update: update,
  delete: _delete,
  one: one,
})
