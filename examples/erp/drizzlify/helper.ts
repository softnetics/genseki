import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { Builder, defineBaseConfig } from '@kivotos/core'

import * as schema from '~/db/schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle({ client: pool, schema: schema, logger: true })

export const baseConfig = defineBaseConfig({
  db: db,
  schema: schema,
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
      // sendEmailVerfication(email) {
      //   console.log('sendEmailVerfication', email)
      // },
      // skipEmailVerification: false,
    },
    secret: '',
  },
})

export const builder = new Builder(baseConfig).$context<typeof baseConfig.context>()
