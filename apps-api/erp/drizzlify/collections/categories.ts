import { builder } from '../helper'

const categoriesField = builder.fields('categories', (fb) => ({
  id: fb.columns('id', {
    type: 'text',
  }),
  name: fb.columns('name', {
    type: 'text',
  }),
  owner: fb.relations('owner', {
    type: 'connect',
    options: builder.options(async ({ db }) => {
      const result = await db.query.users.findMany({ columns: { id: true, name: true } })
      return result.map((user) => ({ label: user.name ?? user.id, value: user.id }))
    }),
  }),
  posts: fb.relations('posts', {
    type: 'connect',
    options: builder.options(async ({ db }) => {
      const result = await db.query.posts.findMany({ columns: { id: true, title: true } })
      return result.map((post) => ({ label: post.title ?? post.id, value: post.id }))
    }),
  }),
}))
// const categoryTagsField = builder.fields('categoryTags', (fb) => ({
//   id: fb.columns('id', {
//     type: 'text',
//   }),
//   name: fb.columns('name', {
//     type: 'text',
//   }),
//   category: fb.relations('category', {
//     type: 'connect',
//     options: builder.options(async ({ db }) => {
//       const result = await db.query.categories.findMany({ columns: { id: true, name: true } })
//       return result.map((category) => ({ label: category.name ?? category.id, value: category.id }))
//     }),
//   }),
// }))

export const categoriesCollection = builder.collection('categories', {
  slug: 'categories',
  primaryField: 'id',
  fields: categoriesField,
})
