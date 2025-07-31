import { builder, prisma } from '../helper'

export const subCategoriesCollection = builder.collection('subCategories', {
  identifierColumn: 'id',
  fields: builder.fields('subCategory', (fb) => ({
    name: fb.columns('name', {
      type: 'text',
      isRequired: true,
      label: 'Name',
      description: 'The name of the sub category',
    }),
    categories: fb.relations('categories', (fb) => ({
      type: 'connect',
      label: 'Categories',
      fields: fb.fields('category', (fb) => ({
        name: fb.columns('name', {
          type: 'text',
          label: 'Name',
          description: 'The name of the category',
        }),
      })),
      options: builder.options(async () => {
        const result = await prisma.category.findMany()
        return result.map((category) => ({ label: category.name ?? 'Unknown', value: category.id }))
      }),
    })),
  })),
})
