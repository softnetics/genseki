import z from 'zod/v4'

import { defineNextJsServerConfig } from '@genseki/next'
import { phone } from '@genseki/plugins'
import { defineServerConfig } from '@genseki/react'

import { foodsCollection } from './collections/foods'
import { usersCollection } from './collections/users'
import { baseConfig, builder } from './helper'

const baseServerConfig = defineServerConfig(baseConfig, {
  plugins: [
    phone({
      //  TODO: fix relation type
      baseConfig,
      sendOtp: async (phone) => {
        console.log(`Sending OTP to phone: ${phone}`)
        return {
          status: 'success',
          token: '1234567890abcdef',
          refno: 'ref123456',
        }
      },
      verifyOtp: async (args: { token: string; pin: string }) => {
        console.log(`Verifying OTP: ${args.pin} for token: ${args.token}`)
        return true // Simulate successful verification
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => `${phoneNumber.replace(/\D/g, '')}@example.com`,
        getTempName: (phoneNumber) => `User ${phoneNumber.replace(/\D/g, '')}`,
      },
    }),
  ],
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
