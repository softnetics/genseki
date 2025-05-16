import { builder } from '../helper'

export const usersCollection = builder.collection('users', {
  slug: 'users',
  primaryField: 'id',
  fields: builder.fields('users', (fb) => ({
    id: fb.columns('id', {
      type: 'text',
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
