import z from 'zod'

import { createAccessControl } from '@genseki/plugins'
import {
  Builder,
  type Contextable,
  HttpUnauthorizedError,
  RequestContextable,
} from '@genseki/react'

import { FullModelSchemas } from '../generated/genseki/unsanitized'
import { PrismaClient } from '../generated/prisma'

export const prisma = new PrismaClient()

interface User {
  id: string
  name?: string | null
  email?: string | null
}

export const AccessControlRole = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CLIENT: 'client',
} as const

const accessControl = createAccessControl({
  statements: {
    userManagement: {
      staff: ['create', 'read', 'update', 'delete'],
      client: ['create', 'read', 'update', 'delete'],
    },
    inventoryManagement: {
      product: ['create', 'read', 'update', 'delete'],
      category: ['create', 'read', 'update', 'delete'],
    },
  },
  roles: {
    [AccessControlRole.ADMIN]: {
      userManagement: {
        staff: ['create', 'read', 'update', 'delete'],
        client: ['create', 'read', 'update', 'delete'],
      },
      inventoryManagement: {
        category: ['create', 'read'],
      },
    },
    [AccessControlRole.CLIENT]: {
      userManagement: {
        staff: ['read'],
      },
      inventoryManagement: {
        product: ['read'],
        category: ['read'],
      },
    },
  },
})

class MyRequestContext extends RequestContextable<User> {
  constructor(context: MyContext, request: Request) {
    super(context, request)
  }

  async getAccessControl() {
    return accessControl
  }

  async authenticate() {
    const sessionValue = this.getSessionCookie()
    if (!sessionValue) throw new HttpUnauthorizedError('No session cookie found')

    const session = await prisma.session.findUnique({
      select: { user: { select: { id: true, name: true, email: true } } },
      where: { token: sessionValue },
    })

    if (!session) throw new HttpUnauthorizedError('User not authenticated')

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    }
  }
}

export class MyContext implements Contextable<User> {
  constructor() {}

  getUserSchema() {
    return z.object({
      id: z.string(),
      name: z.string().nullish(),
      email: z.email().nullish(),
    })
  }

  getPrismaClient() {
    return prisma as any
  }

  toRequestContext(request: Request) {
    return new MyRequestContext(this, request)
  }
}

export const context = new MyContext()

export const builder = new Builder({
  schema: FullModelSchemas,
  context: context,
})
