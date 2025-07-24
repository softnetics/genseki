import { Builder, type Contextable, RequestContextable } from '@genseki/react'

import { FullModelSchemas } from '../generated/genseki/unsanitized'
import { PrismaClient } from '../generated/prisma'

export const prisma = new PrismaClient()

interface User {
  id: string
  name?: string | null
  email?: string | null
}

class MyRequestContext extends RequestContextable<User> {
  constructor(request: Request) {
    super(request)
  }

  async requiredAuthenticated() {
    const sessionValue = this.getSessionCookie()

    if (!sessionValue) {
      throw new Error('User not authenticated')
    }

    const session = await prisma.session.findUnique({
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      where: {
        token: sessionValue,
      },
    })

    if (!session) {
      throw new Error('User not authenticated')
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
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
