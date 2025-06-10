import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const postTs = pgTable('post_db', {
  idTs: text('id_db').primaryKey(),
  nameTs: varchar('name_db', { length: 100 }).notNull(),

  createdAtTs: timestamp('created_at_db').defaultNow().notNull(),
  updatedAtTs: timestamp('updated_at_db').defaultNow().notNull(),
})

// Posts with relation all table
export const authorTs = pgTable('author_db', {
  idTs: text('id_db').primaryKey(),
  nameTs: varchar('name_db', { length: 100 }).notNull(),

  createdAtTs: timestamp('created_at_db').defaultNow().notNull(),
  updatedAtTs: timestamp('updated_at_db').defaultNow().notNull(),
})

export const postWithAuthorTs = pgTable('post_with_author_db', {
  idTs: text('id_db').primaryKey(),
  nameTs: varchar('name_db', { length: 100 }).notNull(),

  authorIdTs: integer('author_id_db').references(() => authorTs.idTs),

  createdAtTs: timestamp('created_at_db').defaultNow().notNull(),
  updatedAtTs: timestamp('updated_at_db').defaultNow().notNull(),
})

// Relations
export const authorsRelationsTs = relations(authorTs, ({ many }) => ({
  postsTs: many(postWithAuthorTs),
}))

export const postsRelationsTs = relations(postWithAuthorTs, ({ one }) => ({
  authorTs: one(authorTs, {
    fields: [postWithAuthorTs.authorIdTs],
    references: [authorTs.idTs],
  }),
}))
