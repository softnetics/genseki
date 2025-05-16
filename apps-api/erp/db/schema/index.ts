import { relations } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

const timestamps = {
  updatedAt: timestamp().defaultNow(),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
}

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
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
