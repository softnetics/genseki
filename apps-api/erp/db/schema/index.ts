import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

const timestamps = {
  updatedAt: timestamp().defaultNow(),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
}

export const users = pgTable('users', {
  id: uuid().primaryKey(),
  firstName: varchar(),
  lastName: varchar(),
  email: varchar(),
  password: varchar(),
  fullName: varchar(),
  ...timestamps,
})

export const posts = pgTable('posts', {
  id: uuid().primaryKey(),
  title: varchar(),
  content: text(),
  authorId: uuid().references(() => users.id),
  categoryId: uuid().references(() => categories.id),
  ...timestamps,
})

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  category: one(categories, { fields: [posts.categoryId], references: [categories.id] }),
}))

export const categories = pgTable('categories', {
  id: uuid().primaryKey(),
  name: varchar().notNull(),
  ownerId: uuid().references(() => users.id),
  ...timestamps,
})

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  posts: many(posts),
  owner: one(users, { fields: [categories.ownerId], references: [users.id] }),
  tags: many(categoryTags),
}))

export const categoryTags = pgTable('categoryTags', {
  id: uuid().primaryKey(),
  name: varchar().notNull(),
  category: uuid().references(() => categories.id),
  ...timestamps,
})

export const categoryTagsRelations = relations(categoryTags, ({ one }) => ({
  category: one(categories, { fields: [categoryTags.category], references: [categories.id] }),
}))
