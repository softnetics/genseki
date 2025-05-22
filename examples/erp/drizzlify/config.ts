import z from 'zod'

import { wrapNextJs } from '@kivotos/next'

import { categoriesCollection } from './collections/categories'
import { postsCollection } from './collections/posts'
import { usersCollection } from './collections/users'
import { baseConfig, builder } from './helper'

const serverConfig = wrapNextJs(
  baseConfig.toServerConfig({
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
)

export type ServerConfig = typeof serverConfig
export { serverConfig }
