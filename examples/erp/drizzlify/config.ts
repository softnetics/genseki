import z from 'zod/v4'

import { defineNextJsServerConfig } from '@genseki/next'
import { phone } from '@genseki/plugins'
import { defineServerConfig, StorageAdapterS3 } from '@genseki/react'

import * as schema from '~/db/schema'

import { foodsCollection } from './collections/foods'
import { usersCollection } from './collections/users'
import { builder, db, MyContext } from './helper'

const context = new MyContext()

const baseServerConfig = defineServerConfig({
  db: db,
  schema: schema,
  context: context,
  storageAdapter: StorageAdapterS3.initailize({
    bucket: process.env.AWS_BUCKET_NAME!,
    clientConfig: {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
      },
    },
  }),
  auth: {
    resetPassword: {
      enabled: true,
      async sendEmailResetPassword(email, token) {
        console.log('sendEmailResetPassword config', email, token)
        return
      },
    },
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
    secret: '',
  },
  plugins: [
    phone({
      db: db,
      schema: schema,
      context: context,
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
