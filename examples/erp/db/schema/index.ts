import { relations } from 'drizzle-orm'
import {
  boolean,
  date,
  decimal,
  json,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

const timestamps = {
  updatedAt: timestamp().defaultNow(),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
}

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  ...timestamps,
})

export const session = pgTable('session', {
  id: uuid('id').primaryKey().defaultRandom(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  ...timestamps,
})

export const account = pgTable('account', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  ...timestamps,
})

export const verification = pgTable('verification', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ...timestamps,
})

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar(),
  content: json(),
  authorId: uuid().references(() => user.id),
  categoryId: uuid().references(() => categories.id),
  ...timestamps,
})

export const usersRelations = relations(user, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(user, { fields: [posts.authorId], references: [user.id] }),
  category: one(categories, { fields: [posts.categoryId], references: [categories.id] }),
}))

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar().notNull(),
  ownerId: uuid().references(() => user.id),
  ...timestamps,
})

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  posts: many(posts),
  owner: one(user, { fields: [categories.ownerId], references: [user.id] }),
  tags: many(categoryTags),
}))

export const categoryTags = pgTable('categoryTags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar().notNull(),
  category: uuid().references(() => categories.id),
  ...timestamps,
})

export const categoryTagsRelations = relations(categoryTags, ({ one }) => ({
  category: one(categories, { fields: [categoryTags.category], references: [categories.id] }),
}))

export const typesEnum = pgEnum('types', ['fruit', 'vegetable', 'meat', 'dairy', 'grain', 'other'])
export const foods = pgTable('foods', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar().notNull(),
  isCooked: boolean('is_cooked').default(true).notNull(),
  description: json(),
  cookingTypes: typesEnum().notNull().default('other'),
  cookingDuration: decimal({ mode: 'number' }).notNull(),
  // TODO: Make type infer for {mode:"string" | "date"}
  cookingDate: date().notNull().defaultNow(), // YYYY-MM-DD
  cookingTime: time().notNull().defaultNow(), // 00:00:00 - 24:00:00
})

export const foodsRelations = relations(foods, ({ many }) => ({
  foodImages: many(foodImages),
}))

export const foodImages = pgTable('foodImages', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: text('url').notNull(),
  foodId: uuid('foodId').references(() => foods.id),
})

export const foodImagesRelations = relations(foodImages, ({ one }) => ({
  food: one(foods, {
    fields: [foodImages.foodId],
    references: [foods.id],
  }),
}))
