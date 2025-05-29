import { builder } from '../helper'

export const foodsCollection = builder.collection('foods', {
  slug: 'foods',
  identifierColumn: 'id',
  fields: builder.fields('foods', (fb) => ({
    name: fb.columns('name', {
      type: 'text',
      label: 'Food name',
      create: 'enabled',
      update: 'disabled',
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
      options: (args) => {
        const res = args.db._.schema?.foods.columns.cookingTypes.enumValues || []

        return res.map((v) => ({ label: v, value: v }))
      },
    }),
    cookingDuration: fb.columns('cookingDuration', {
      type: 'number',
      label: 'Cooking duration',
      placeholder: 'Duration (Seconds)',
      default: 10,
    }),
    cookingDate: fb.columns('cookingDate', {
      type: 'date',
      label: 'Cooking date',
      default: new Date('2025-04-24'),
    }),
    cookingTime: fb.columns('cookingTime', {
      type: 'time',
      label: 'Cooking time',
      default: new Date(),
    }),
  })),
})
