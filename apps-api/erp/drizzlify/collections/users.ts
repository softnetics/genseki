import { builder } from '../helper'

const usersField = builder.fieldsFrom('users')

export const usersCollection = builder.collection('users', {
  slug: 'users',
  primaryField: 'id',
  fields: {
    id: usersField.columns('id', {
      type: 'text',
    }),
    firstName: usersField.columns('firstName', {
      type: 'text',
    }),
    lastName: usersField.columns('lastName', {
      type: 'text',
    }),
    fullName: usersField.columns('fullName', {
      type: 'text',
    }),
    email: usersField.columns('email', {
      type: 'text',
    }),
    password: usersField.columns('password', {
      type: 'text',
    }),
  },
})
