import Color from '@tiptap/extension-color'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'
import { StarterKit } from '@tiptap/starter-kit'

import {
  BackColorExtension,
  CustomImageExtension,
  ImageUploadNodeExtension,
  SelectionExtension,
} from '@genseki/react'

import { EditorSlotBefore } from '../editor/slot-before'
import { builder } from '../helper'

export const foodsCollection = builder.collection('foods', {
  slug: 'foods',
  identifierColumn: 'id',
  fields: builder.fields('foods', (fb) => ({
    name: fb.columns('name', {
      type: 'text',
      isRequired: true,
      label: 'Food name',
      create: 'enabled',
      description: 'A food name',
      update: 'disabled',
    }),
    foodImages: fb.relations('foodImages', (fb) => ({
      type: 'create',
      fields: fb.fields('foodImages', (fb) => ({
        url: fb.columns('url', {
          type: 'media',
          isRequired: true,
          label: 'Food image URL',
          description: 'A food image URL',
          uploadOptions: {
            maxSize: 1024 * 1024 * 5,
            mimeTypes: ['image/*'],
          },
        }),
      })),
    })),
    description: fb.columns('description', {
      type: 'richText',
      isRequired: true,
      label: 'Food description',
      default: 'This is a example default rich text content',
      editor: {
        immediatelyRender: true,
        shouldRerenderOnTransaction: true,
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
      },
    }),
    isCooked: fb.columns('isCooked', {
      type: 'checkbox',
      label: 'Food cooked',
      default: true,
      description: 'Is the food cooked?',
    }),
    cookingTypes: fb.columns('cookingTypes', {
      type: 'selectText',
      label: 'Cooking types',
      isRequired: true,
      options: (args) => {
        const res = args.db._.schema?.foods.columns.cookingTypes.enumValues || []

        return res.map((v) => ({ label: v, value: v }))
      },
    }),
    cookingDuration: fb.columns('cookingDuration', {
      type: 'number',
      label: 'Cooking duration',
      placeholder: 'Duration (Seconds)',
      isRequired: true,
      default: 10,
    }),
    cookingDate: fb.columns('cookingDate', {
      type: 'date',
      label: 'Cooking date',
      isRequired: true,
    }),
    cookingTime: fb.columns('cookingTime', {
      type: 'time',
      label: 'Cooking time',
      isRequired: true,
    }),
  })),
})
