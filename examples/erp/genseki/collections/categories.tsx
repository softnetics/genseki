import { builder } from '../helper'

export const categoriesCollection = builder.collection('categories', {
  identifierColumn: 'id',
  fields: builder.fields('category', (fb) => ({
    name: fb.columns('name', {
      type: 'text',
      isRequired: true,
    }),
  })),
})
