import z from 'zod/v4'

import { defineServerConfig } from '@kivotos/core'
import { defineNextJsServerConfig } from '@kivotos/next'

import { categoriesCollection } from './collections/categories'
import { postsCollection } from './collections/posts'
import { usersCollection } from './collections/users'
import { baseConfig, builder } from './helper'

const baseServerConfig = defineServerConfig(baseConfig, {
  collections: {
    users: usersCollection,
    posts: postsCollection,
    categories: categoriesCollection,
  },
  endpoints: {
    customOne: builder.endpoint(
      {
        path: '/hello',
        query: z.object({
          name: z.string().optional(),
        }),
        method: 'GET',
        responses: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
      ({ query }) => {
        return {
          status: 200 as const,
          body: {
            message: `Hello ${query.name ?? 'World'}`,
          },
        }
      }
    ),
    customTwo: builder.endpoint(
      {
        path: '/hello2',
        query: z.object({
          name: z.string().optional(),
        }),
        method: 'GET',
        responses: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
      ({ query }) => {
        return {
          status: 200 as const,
          body: {
            message: `Hello2 ${query.name ?? 'World'}`,
          },
        }
      }
    ),
  },
})

const serverConfig = defineNextJsServerConfig(baseServerConfig)

export { serverConfig }
