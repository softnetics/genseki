import { AccountProvider, HttpInternalServerError, Password } from '@genseki/react'

import { AccessControlRole, prisma } from '../helper'

export abstract class AuthService {
  static async setup(payload: { name: string; email: string; password: string }) {
    // Check if have at least one user
    const userCount = await prisma.user.count()
    if (userCount > 0) {
      throw new HttpInternalServerError('Setup already completed')
    }

    // Create the new user
    const hashedPassword = await Password.hashPassword(payload.password)

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          roles: [AccessControlRole.ADMIN], // Assign admin role
        },
      })

      const account = await tx.account.create({
        data: {
          userId: user.id,
          accountId: user.id, // Use user ID as account ID
          provider: AccountProvider.CREDENTIAL,
          password: hashedPassword,
        },
      })

      return { user, account }
    })

    return result
  }
}
