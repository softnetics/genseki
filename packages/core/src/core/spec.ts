import { drizzle } from 'drizzle-orm/node-postgres'
import z from 'zod'

import * as schema from './__mocks__/complex-schema'
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
    oauth2: {
      google: {
        clientId: '',
        clientSecret: '',
      },
    },
    secret: '',
  },
})

const builder = baseConfig.builder()

const authorFieldBuilder = builder.fieldsFrom('authors')

const authorFields = {
  id: authorFieldBuilder.columns('id', {
    type: 'text',
  }),
  name: authorFieldBuilder.columns('name', {
    type: 'text',
  }),
  email: authorFieldBuilder.columns('email', {
    type: 'text',
  }),
}

const categoryFieldBuilder = builder.fieldsFrom('categories')

const categoryFields = {
  id: categoryFieldBuilder.columns('id', {
    type: 'text',
  }),
  name: categoryFieldBuilder.columns('name', {
    type: 'text',
  }),
}

const postToTagsFieldBuilder = builder.fieldsFrom('postsToTags')

const postToTagsFields = {
  postId: postToTagsFieldBuilder.columns('postId', {
    type: 'number',
  }),
  tagId: postToTagsFieldBuilder.columns('tagId', {
    type: 'selectNumber',
    options: async (context) => {
      const result = await context.db.query.tags.findMany()
      return result.map((tag) => ({
        label: tag.name,
        value: tag.id,
      }))
    },
  }),
}

export const authorCollection = builder.collection('authors', {
  slug: 'authors',
  fields: authorFields,
  primaryField: 'id',
})

const postFieldBuilder = builder.fieldsFrom('posts')

export const postCollection = builder.collection('posts', {
  slug: 'posts',
  fields: {
    id: postFieldBuilder.columns('id', {
      type: 'number',
    }),
    title: postFieldBuilder.columns('title', {
      type: 'text',
    }),
    content: postFieldBuilder.columns('content', {
      type: 'text',
    }),
    author: postFieldBuilder.relations('author', {
      type: 'connectOrCreate',
      fields: authorFields,
      options: async (args) => {
        const result = await args.db.query.authors.findMany()
        return result.map((author) => ({
          label: author.name,
          value: author.id,
        }))
      },
    }),
    categories: postFieldBuilder.relations('category', {
      type: 'connectOrCreate',
      fields: categoryFields,
      options: async (args) => {
        const result = await args.db.query.categories.findMany()
        return result.map((category) => ({
          label: category.name,
          value: category.id,
        }))
      },
    }),
    tags: postFieldBuilder.relations('tags', {
      type: 'create',
      fields: postToTagsFields,
    }),
  },
  primaryField: 'id',
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
            status: 200,
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
          status: 200,
          body: {
            hello: name,
          },
        }
      }
    ),
  },
})

export const clientConfig = getClientConfig(serverConfig)
