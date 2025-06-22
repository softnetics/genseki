import z from 'zod/v4'

import { defineNextJsServerConfig } from '@genseki/next'
import { defineServerConfig } from '@genseki/react'

import { foodsCollection } from './collections/foods'
import { usersCollection } from './collections/users'
import { baseConfig, builder } from './helper'

const baseServerConfig = defineServerConfig(baseConfig, {
  collections: {
    users: usersCollection,
    foods: foodsCollection,
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
