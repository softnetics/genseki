import { Builder, type Contextable, RequestContextable } from '@genseki/react'

import { FullModelSchemas } from '../generated/genseki/unsanitized'
import { PrismaClient } from '../generated/prisma'

export const prisma = new PrismaClient()

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
    return {
      id: '123',
      name: 'John Doe',
      email: 'john@gmail.com',
    }
  }
}

export class MyContext implements Contextable<User> {
  constructor() {}

  getPrismaClient() {
    return prisma as any
  }

  toRequestContext(request: Request) {
    return new MyRequestContext(request)
  }
}

export const context = new MyContext()

export const builder = new Builder({
  schema: FullModelSchemas,
  context: context,
})
