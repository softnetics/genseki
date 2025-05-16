import z from 'zod'

import { categoriesCollection } from './collections/categories'
import { postsCollection } from './collections/posts'
import { usersCollection } from './collections/users'
import { baseConfig, builder } from './helper'

export const serverConfig = baseConfig.toServerConfig({
  collections: [usersCollection, postsCollection, categoriesCollection],
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
          status: 200,
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
          status: 200,
          body: {
            message: `Hello2 ${query.name ?? 'World'}`,
          },
        }
      }
    ),
  },
})
