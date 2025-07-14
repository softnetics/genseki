import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { Builder, type Contextable, RequestContextable } from '@genseki/react'

import * as schema from '~/db/schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle({ client: pool, schema: schema, logger: true })

interface User {
  id: string
  name: string
  email: string
}

class MyRequestContext extends RequestContextable<User> {
  constructor(request: Request) {
    super(request)
  }

  requiredAuthenticated() {
    // Simulate an authenticated user
    return {
      id: '123',
      name: 'John Doe',
      email: 'example@example.com',
    }
  }
}

export class MyContext implements Contextable<User> {
  constructor() {}

  toRequestContext(request: Request) {
    return new MyRequestContext(request)
  }
}

export const builder = new Builder({ db, schema, context: new MyContext() })
