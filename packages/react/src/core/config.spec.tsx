import { drizzle } from 'drizzle-orm/node-postgres'
import z from 'zod/v4'

import * as schema from './__mocks__/complex-schema'
import { Builder } from './builder'
import { GensekiApp } from './config'
import { type Contextable, type RequestContextable, type RequestContextArgs } from './context'

const db = drizzle({
  connection: '',
  schema: schema,
})

interface User {
  id: string
  name: string
  email: string
}

class MyRequestContext implements RequestContextable<User> {
  constructor() {}

  requiredAuthenticated() {
    // Simulate an authenticated user
    return {
      id: '123',
      name: 'John Doe',
      email: 'example@example.com',
    }
  }
}

class MyContext implements Contextable<User> {
  constructor() {}

  toRequestContext(args: RequestContextArgs) {
    return new MyRequestContext()
  }
}

const builder = new Builder({ db, schema, context: new MyContext() })

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
    example: fb.columns('bio', {
      type: 'selectText',
      options: async (context) => {
        const result = await db.query.authors.findMany()
        return result.map((author) => ({
          label: author.name,
          value: author.id,
        }))
      },
    }),
  })),
  identifierColumn: 'id',
})

const x = builder.fields('authors', (fb) => ({
  id: fb.columns('id', {
    type: 'text',
  }),
  name: fb.columns('name', {
    type: 'text',
  }),
  email: fb.columns('email', {
    type: 'text',
  }),
  example: fb.columns('bio', {
    type: 'selectText',
    options: async (context) => {
      const result = await db.query.authors.findMany()
      return result.map((author) => ({
        label: author.name,
        value: author.id,
      }))
    },
  }),
}))

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
      options: async () => {
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
          options: async () => {
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
      create: async (args) => {
        return { __id: 'create-post-endpoint', __pk: 'id' }
      },
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

export const app = new GensekiApp({
  title: 'Genseki App',
  components: {
    Layout: ({ children }) => <div>{children}</div>,
    NotFound: () => <div>Not Found</div>,
    CollectionLayout: ({ children }) => <div>{children}</div>,
  },
})
  .apply(authorCollection)
  .apply(postCollection)
