import z from 'zod'

import { type Contextable, RequestContextable } from '../context'
import type { MockPrismaClient } from '../prisma.types'

class MockRequestContext extends RequestContextable<{ id: string }> {
  constructor(context: MockContext, request: Request) {
    super(context, request)
  }

  authenticate() {
    return {
      id: 'mock-user-id',
    }
  }
}

class MockContext implements Contextable<{ id: string }> {
  getUserSchema() {
    return z.object({
      id: z.string(),
    })
  }

  getPrismaClient(): MockPrismaClient {
    throw new Error('Method not implemented.')
  }

  toRequestContext(request: Request) {
    return new MockRequestContext(this, request)
  }
}

export const mockContext = new MockContext()
