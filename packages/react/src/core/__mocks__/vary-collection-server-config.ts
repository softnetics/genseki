import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { drizzle } from 'drizzle-orm/node-postgres'

import { allFieldTypes } from './all-type-schema'
import * as baseSchema from './complex-schema'

import {
  BackColorExtension,
  CustomImageExtension,
  ImageUploadNodeExtension,
  SelectionExtension,
} from '../../react'
import { Builder } from '../builder'
import { defineBaseConfig, defineServerConfig } from '../config'

const schema = {
  ...baseSchema,
  vary: allFieldTypes,
}
const db = drizzle({
  connection: '',
  schema: schema,
})

export const postEditorProviderProps = {
  immediatelyRender: false,
  shouldRerenderOnTransaction: true,
  content: '<h2>This came from Post content field</h2>',
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

export const baseConfig = defineBaseConfig({
  db: db,
  schema: schema,
  context: { example: 'example' },
  auth: {
    user: {
      model: schema.user,
    },
    session: {
      model: schema.session,
    },
    account: {
      model: schema.account,
    },
    verification: {
      model: schema.verification,
    },
    emailAndPassword: {
      enabled: true,
    },
    oauth2: {
      google: {
        enabled: true,
        clientId: '',
        clientSecret: '',
      },
    },
    secret: '',
  },
})
const builder = new Builder({ schema }).$context<typeof baseConfig.context>()
const vary = builder.collection('vary', {
  slug: 'allFields',
  identifierColumn: 'bigserialBigInt',
  fields: builder.fields('vary', (fb) => ({
    integer: fb.columns('integer', {
      type: 'number',
    }),
    smallint: fb.columns('smallint', { type: 'number' }),
    // bigint: fb.columns('bigint', { type: 'number' }), // Not supported yet
    serial: fb.columns('serial', { type: 'number' }),
    smallserial: fb.columns('smallserial', { type: 'number' }),
    bigserial_number: fb.columns('bigserialNumber', { type: 'number' }),
    // bigserialBigInt: fb.columns('bigserialBigInt', { type: 'number' }), // Not supported yet
    boolean: fb.columns('boolean', { type: 'switch' }),
    text: fb.columns('text', { type: 'text' }),
    text_enum: fb.columns('textEnum', { type: 'text' }),
    varchar: fb.columns('varchar', { type: 'text' }),
    char: fb.columns('char', { type: 'text' }),
    // numeric: fb.columns('numeric', { type: 'text' }), // Not supported yet
    // decimal: fb.columns('decimal', { type: 'text' }), // Not supported yet
    real: fb.columns('real', { type: 'number' }),
    doublePrecision: fb.columns('doublePrecision', { type: 'number' }),
    json: fb.columns('json', { type: 'richText', editor: postEditorProviderProps }), // Not supported yet
    jsonType: fb.columns('jsonType', { type: 'richText', editor: postEditorProviderProps }), // Not supported yet
    jsonb: fb.columns('jsonb', { type: 'richText', editor: postEditorProviderProps }), // Not supported yet
    jsonbType: fb.columns('jsonbType', { type: 'richText', editor: postEditorProviderProps }), // Not supported yet
    time: fb.columns('time', { type: 'time' }),
    timestamp: fb.columns('timestamp', { type: 'date' }),
    date: fb.columns('date', { type: 'date' }),
    // interval: fb.columns('interval', { type: 'time' }), // Not supported yet
    // point: fb.columns('point', { type: 'comboboxNumber' }), // Not supported yet
    // line: fb.columns('line', { type: 'comboboxNumber' }), // Not supported yet
    // enum: fb.columns('enum', { type: 'comboboxNumber' }), // Not supported yet

    arrayOfText: fb.columns('arrayOfText', {
      type: 'comboboxText',
      options: () => [{ label: '', value: '' }],
    }),
    arrayOfNumbers: fb.columns('arrayOfNumbers', {
      type: 'comboboxNumber',
      options: () => [{ label: '', value: 0 }],
    }),
    // arrayOfObjects: fb.columns('arrayOfObjects', {
    //   type: 'comboboxText',
    //   options: () => [{ label: '', value: '' }],
    // }), Not supported yet
    arrayOfBooleans: fb.columns('arrayOfBooleans', {
      type: 'comboboxBoolean',
      options: () => [{ label: '', value: false }],
    }),
    arrayOfDates: fb.columns('arrayOfDates', {
      type: 'comboboxText',
      options: () => [{ label: '', value: '' }],
    }),
    arrayOfTimes: fb.columns('arrayOfTimes', {
      type: 'comboboxText',
      options: () => [{ label: '', value: '' }],
    }),
    // arrayOfTimestamps: fb.columns('arrayOfTimestamps', {
    //   type: '',
    //   options: () => [{ label: '', value: '' }],
    // }),// Not supported yet
    // arrayOfPoints: fb.columns('arrayOfPoints', {
    //   type: '',
    //   options: () => [{ label: '', value: '' }],
    // }), // Not supported yet
    // arrayOfLines: fb.columns('arrayOfLines', {
    //   type: '',
    //   options: () => [{ label: '', value: '' }],
    // }), // Not supported yet
    arrayOfEnums: fb.columns('arrayOfEnums', {
      type: 'comboboxText',
      options: () => [{ label: '', value: '' }],
    }),
    // arrayOfJson: fb.columns('arrayOfJson', {
    //   type: '',
    //   options: () => [{ label: '', value: '' }],
    // }), // Not supported yet
    // arrayOfJsonb: fb.columns('arrayOfJsonb', {
    //   type: '',
    //   options: () => [{ label: '', value: '' }],
    // }), // Not supported yet
  })),
})
export const serverConfig = defineServerConfig(baseConfig, {
  collections: {
    vary,
  },
})

export type VaryCollectionFields = typeof serverConfig.collections.vary.fields
export type ServerConfigContext = typeof serverConfig.context
