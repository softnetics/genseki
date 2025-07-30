import { builder, db } from '../helper'

export const manyCategoriesCollection = builder.collection('manyCategories', {
  slug: 'manyCategories',
  identifierColumn: 'id',
  fields: builder.fields('manyCategories', (fb) => ({
    name: fb.columns('name', {
      type: 'text',
      isRequired: true,
      label: 'Many Categories Name',
      description: 'A many categories name',
    }),
    categoryIds: fb.columns('categoryIds', {
      type: 'comboboxText',
      options: async () => {
        const categories = await db.query.categories.findMany({ columns: { id: true, name: true } })
        return categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))
      },
    }),
  })),
})
