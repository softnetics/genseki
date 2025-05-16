import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { Builder, defineBaseConfig } from '@repo/drizzlify'

import * as schema from '~/db/schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle({ client: pool, schema: schema })

export const baseConfig = defineBaseConfig({
  db: db,
  schema: schema,
  context: {
    example: '',
    di: {},
  },
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
        sendEmailVerfication(email) {
          console.log('sendEmailVerfication', email)
        },
        skipEmailVerification: false,
      },
      phoneNumber: {
        enabled: true,
        getTemporaryEmail(phoneNumber) {
          console.log('getTemporaryEmail', phoneNumber)
          return ''
        },
        getTemporaryName(phoneNumber) {
          console.log('getTemporaryName', phoneNumber)
          return ''
        },
        sendSmsOtpVerification(phoneNumber) {
          console.log('sendSmsOtpVerification', phoneNumber)
        },
        skipPhoneVerification: false,
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

export const builder = new Builder(baseConfig).$context<typeof baseConfig.context>()
