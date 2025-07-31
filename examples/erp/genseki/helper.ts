import { createAccessControl } from '@genseki/plugins'
import { Builder, type Contextable, RequestContextable } from '@genseki/react'

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
  constructor(request: Request) {
    super(request)
  }

  async getAccessControl() {
    return accessControl
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
