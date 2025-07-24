import { type Contextable, RequestContextable } from '../context'
import type { MockPrismaClient } from '../prisma.types'

class MockRequestContext extends RequestContextable {
  constructor(request: Request) {
    super(request)
  }

  requiredAuthenticated() {
    return {
      id: 'mock-user-id',
    }
  }
}

class MockContext implements Contextable {
  getPrismaClient(): MockPrismaClient {
    throw new Error('Method not implemented.')
  }

  toRequestContext(request: Request) {
    return new MockRequestContext(request)
  }
}

export const mockContext = new MockContext()
