import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { Builder, defineBaseConfig } from '@kivotos/core'

import * as schema from '~/db/schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle({ client: pool, schema: schema })

export const baseConfig = defineBaseConfig({
  db: db,
  schema: schema,
  auth: {
    user: { model: schema.users },
    account: { model: schema.accounts },
    session: { model: schema.sessions },
    verification: { model: schema.verifications },
    secret: 'secret',
  },
})

export const builder = new Builder(baseConfig).$context<typeof baseConfig.context>()
