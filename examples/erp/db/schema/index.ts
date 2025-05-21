import { relations, sql } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

const timestamps = {
  updatedAt: timestamp().defaultNow(),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
}

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  ...timestamps,
})

export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ...timestamps,
})

export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  ...timestamps,
})

export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ...timestamps,
})

export const posts = pgTable('posts', {
  id: uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
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
  id: uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
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
  id: uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar().notNull(),
  category: uuid().references(() => categories.id),
  ...timestamps,
})

export const categoryTagsRelations = relations(categoryTags, ({ one }) => ({
  category: one(categories, { fields: [categoryTags.category], references: [categories.id] }),
}))
