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

  async requiredAuthenticated() {
    const sessionValue = this.getSessionCookie()
    if (!sessionValue) {
      throw new Error('Authentication required')
    }

    const session = await db.query.session.findFirst({
      columns: {},
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      where: (session, { eq }) => eq(session.token, sessionValue),
    })

    if (!session) {
      throw new Error('Session not found')
    }

    return session.user
  }
}

export class MyContext implements Contextable<User> {
  constructor() {}

  toRequestContext(request: Request) {
    return new MyRequestContext(request)
  }
}

export const context = new MyContext()

export const builder = new Builder({ db, schema, context: context })
