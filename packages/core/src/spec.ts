import { drizzle } from 'drizzle-orm/node-postgres'
import z from 'zod'

import * as schema from './__mocks__/complex-schema'
import { Builder } from './builder'
import { defineBaseConfig, defineServerConfig, getClientConfig } from './config'
import { admin, createAccessControl } from './plugins/admin'

const db = drizzle({
  connection: '',
  schema: schema,
})

const accessControl = createAccessControl({
  statements: {
    project: ['read', 'create', 'update', 'delete'],
  },
  roles: {
    user: {
      project: ['read', 'delete'],
    },
  },
})

const baseConfig = defineBaseConfig({
  db: db,
  schema: schema,
  context: { example: 'example' },
  auth: {
    user: {
      model: schema.user,
    },
    session: {
      model: schema.session,
    },
    account: {
      model: schema.account,
    },
    verification: {
      model: schema.verification,
    },
    emailAndPassword: {
      enabled: true,
    },
    oauth2: {
      google: {
        enabled: true,
        clientId: '',
        clientSecret: '',
      },
    },
    secret: '',
  },
})

const builder = new Builder({ schema }).$context<typeof baseConfig.context>()

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
  identifierColumn: 'id',
})

export const postCollection = builder.collection('posts', {
  slug: 'posts',
  fields: builder.fields('posts', (fb) => ({
    id: fb.columns('id', {
      type: 'text',
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
      options: async ({ db }) => {
        const result = await db.query.authors.findMany()
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
      options: async ({ db }) => {
        const result = await db.query.categories.findMany()
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
          options: async ({ db }) => {
            const result = await db.query.tags.findMany()
            return result.map((tag) => ({
              label: tag.name,
              value: tag.id,
            }))
          },
        }),
      })),
    })),
  })),
  identifierColumn: 'id',
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
        ({ requestContext, body }) => {
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
        ({ requestContext, body }) => {
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

export const serverConfig = defineServerConfig(baseConfig, {
  collections: {
    authors: authorCollection,
    posts: postCollection,
  },
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
      ({ requestContext, body }) => {
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
  plugins: [
    admin(baseConfig, {
      accessControl: accessControl,
    }),
  ],
})

export const clientConfig = getClientConfig(serverConfig)
