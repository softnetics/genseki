import { drizzle } from 'drizzle-orm/node-postgres'
import z from 'zod'

import * as schema from './__mocks__/complex-schema'
import { Builder } from './builder'
import { defineBaseConfig, getClientConfig } from './config'

const db = drizzle({
  connection: '',
  schema: schema,
})

const baseConfig = defineBaseConfig({
  db: db,
  schema: schema,
  context: { example: 'example' },
  auth: {
    user: {
      model: schema.users,
    },
    session: {
      model: schema.sessions,
    },
    account: {
      model: schema.accounts,
    },
    verification: {
      model: schema.verifications,
    },
    login: {
      emailAndPassword: {
        enabled: true,
      },
    },
    secret: '',
  },
})

const builder = new Builder(baseConfig).$context<typeof baseConfig.context>()

export const authorCollection = builder.collection('authors', {
  slug: 'authors',
  fields: builder.fields('authors', (fb) => ({
    id: fb.columns('id', {
      type: 'text',
    }),
    name: fb.columns('name', {
      type: 'text',
    }),
    email: fb.columns('email', {
      type: 'text',
    }),
  })),
  identifierField: 'id',
})

export const postCollection = builder.collection('posts', {
  slug: 'posts',
  fields: builder.fields('posts', (fb) => ({
    id: fb.columns('id', {
      type: 'number',
    }),
    title: fb.columns('title', {
      type: 'text',
    }),
    content: fb.columns('content', {
      type: 'text',
    }),
    author: fb.relations('author', (fb) => ({
      type: 'connectOrCreate',
      fields: fb.fields('authors', (fb) => ({
        id: fb.columns('id', {
          type: 'text',
        }),
        name: fb.columns('name', {
          type: 'text',
        }),
        email: fb.columns('email', {
          type: 'text',
        }),
      })),
      options: async (args) => {
        const result = await args.db.query.authors.findMany()
        return result.map((author) => ({
          label: author.name,
          value: author.id,
        }))
      },
    })),
    categories: fb.relations('category', (fb) => ({
      type: 'connectOrCreate',
      fields: fb.fields('categories', (fb) => ({
        id: fb.columns('id', {
          type: 'text',
        }),
        name: fb.columns('name', {
          type: 'text',
        }),
      })),
      options: async (args) => {
        const result = await args.db.query.categories.findMany()
        return result.map((category) => ({
          label: category.name,
          value: category.id,
        }))
      },
    })),
    tags: fb.relations('tags', (fb) => ({
      type: 'create',
      fields: fb.fields('postsToTags', (fb) => ({
        postId: fb.columns('postId', {
          type: 'number',
        }),
        tagId: fb.columns('tagId', {
          type: 'selectNumber',
          options: async (context) => {
            const result = await context.db.query.tags.findMany()
            return result.map((tag) => ({
              label: tag.name,
              value: tag.id,
            }))
          },
        }),
      })),
    })),
  })),
  identifierField: 'id',
  admin: {
    api: {
      // NOTE: user can override some logics
      // create: () => {},
    },
    endpoints: {
      // NOTE: user can override
      customEndpoint: builder.endpoint(
        {
          path: '/hello',
          method: 'POST',
          body: z.object({
            name: z.string(),
          }),
          responses: {
            200: z.object({
              hello: z.string(),
            }),
          },
        },
        ({ context, body }) => {
          const name = body.name
          return {
            status: 200 as const,
            body: {
              hello: 's',
            },
          }
        }
      ),
      customEndpoint2: builder.endpoint(
        {
          path: '/hello2',
          method: 'POST',
          body: z.object({
            name: z.string(),
          }),
          responses: {
            200: z.object({
              hello: z.string(),
            }),
          },
        },
        ({ context, body }) => {
          const name = body.name
          return {
            status: 200 as const,
            body: {
              hello: 's',
            },
          }
        }
      ),
    },
  },
})

export const serverConfig = baseConfig.toServerConfig({
  collections: [authorCollection, postCollection],
  endpoints: {
    createWithPosts: builder.endpoint(
      {
        path: '/hello/:id',
        method: 'POST',
        body: z.object({
          name: z.string(),
        }),
        responses: {
          200: z.object({
            hello: z.string(),
          }),
        },
      },
      ({ context, body }) => {
        const name = body.name
        return {
          status: 200 as const,
          body: {
            hello: name,
          },
        }
      }
    ),
  },
})

export const clientConfig = getClientConfig(serverConfig)
