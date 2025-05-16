import { builder } from '../helper'

const usersField = builder.fields('users', (fb) => ({
  id: fb.columns('id', {
    type: 'text',
  }),
  name: fb.columns('name', {
    type: 'text',
  }),
  email: fb.columns('email', {
    type: 'text',
  }),
}))

export const usersCollection = builder.collection('users', {
  slug: 'users',
  primaryField: 'id',
  fields: usersField,
})
