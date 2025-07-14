import { builder } from '../helper'

export const usersCollection = builder.collection('user', {
  slug: 'users',
  identifierColumn: 'id',
  fields: builder.fields('user', (fb) => ({
    id: fb.columns('id', {
      type: 'text',
      create: 'hidden',
      update: 'disabled',
    }),
    name: fb.columns('name', {
      type: 'text',
    }),
    email: fb.columns('email', {
      type: 'text',
    }),
    image: fb.columns('image', {
      type: 'media',
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    }),
  })),
})
