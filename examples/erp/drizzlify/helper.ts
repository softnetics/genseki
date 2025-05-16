import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { defineBaseConfig } from '@kivotos/core'

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
})

export const builder = baseConfig.builder()
