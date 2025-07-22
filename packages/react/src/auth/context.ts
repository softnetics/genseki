import type { AnyAccountTable, AnyUserTable, AuthOptions } from '.'
import { AccountProvider } from './constant'

import type { AnyContextable } from '../core'
import type { InferTableType } from '../core/table'

export function createAuthInternalHandler(context: AnyContextable, options: AuthOptions) {
  const prisma = context.getPrismaClient()

  const user = {
    async findById(id: string) {
      const modelName = options.schema.user.config.prismaModelName
      const pkField = options.schema.user.shape.primaryFields[0]
      const user = await prisma[modelName].findUnique({
        where: { [pkField]: id },
      })
      if (!user) throw new Error('User not found')
      return user as InferTableType<AuthOptions['schema']['user']>
    },

    async findByEmail(email: string) {
      const modelName = options.schema.user.config.prismaModelName
      const emailField = options.schema.user.shape.columns.email.name
      const user = await prisma[modelName].findFirst({
        where: { [emailField]: email },
      })
      if (!user) throw new Error('User not found')
      return user as InferTableType<AuthOptions['schema']['user']>
    },

    async create(data: Omit<InferTableType<AnyUserTable>, 'id' | 'emailVerified'>) {
      const modelName = options.schema.user.config.prismaModelName

      const user = await prisma[modelName].create({
        data: {
          ...data,
          emailVerified: null, // Set to null by default
        },
      })

      return user as InferTableType<AuthOptions['schema']['user']>
    },
  }

  const account = {
    async link(data: Omit<InferTableType<AnyAccountTable>, 'id' | 'emailVerified'>) {
      const modelName = options.schema.account.config.prismaModelName
      const accountIdField = options.schema.account.shape.columns.userId.name
      const accountIdValue = data[accountIdField as unknown as keyof typeof data]

      const account = await prisma[modelName].upsert({
        where: { [accountIdField]: accountIdValue },
        create: data,
        update: data,
      })

      return account as InferTableType<AuthOptions['schema']['account']>
    },

    async updatePassword(userId: string, password: string) {
      const modelName = options.schema.account.config.prismaModelName
      const userIdField = options.schema.account.shape.columns.userId.name
      const providerField = options.schema.account.shape.columns.provider.name
      const passwordField = options.schema.account.shape.columns.password.name

      const account = await prisma[modelName].update({
        where: {
          [userIdField]: userId,
          [providerField]: AccountProvider.CREDENTIAL,
        },
        data: { [passwordField]: password },
      })

      if (account.length === 0) throw new Error('Account not found')
      if (account.length > 1) throw new Error('Multiple accounts found')
      return account[0]
    },

    async findByUserEmailAndProvider(email: string, providerId: AccountProvider) {
      const emailField = options.schema.user.shape.columns.email.name

      const user = (await prisma[options.schema.user.config.prismaModelName].findUnique({
        where: { [emailField]: email },
      })) as InferTableType<AuthOptions['schema']['user']>

      const userIdField = options.schema.account.shape.columns.userId.name
      const providerField = options.schema.account.shape.columns.provider.name

      const account = (await prisma[options.schema.account.config.prismaModelName].findFirst({
        where: {
          [userIdField]: user.id,
          [providerField]: providerId,
        },
      })) as InferTableType<AuthOptions['schema']['account']>
      return {
        user: user,
        account: account,
      }
    },
  }
  const session = {
    async create(data: { userId: string; expiresAt: Date }) {
      const modelName = options.schema.session.config.prismaModelName

      const token = crypto.randomUUID()

      const userIdField = options.schema.session.shape.columns.userId.name
      const tokenField = options.schema.session.shape.columns.token.name
      const expiredAtField = options.schema.session.shape.columns.expiredAt.name

      const session = await prisma[modelName].create({
        data: {
          [userIdField]: data.userId,
          [tokenField]: token,
          [expiredAtField]: data.expiresAt,
        },
      })

      return session as InferTableType<AuthOptions['schema']['session']>
    },

    async findUserBySessionToken(token: string) {
      const sessionModelName = options.schema.session.config.prismaModelName

      const userIdField = options.schema.session.shape.columns.userId.name
      const tokenField = options.schema.session.shape.columns.token.name

      const session = (await prisma[sessionModelName].findFirst({
        where: { [tokenField]: token },
        select: { [userIdField]: true },
      })) as InferTableType<AuthOptions['schema']['session']>

      if (!session) throw new Error('Session not found')

      const userModelName = options.schema.user.config.prismaModelName
      const pkField = options.schema.user.shape.primaryFields[0]

      const userIdValue = session[userIdField as unknown as keyof typeof session]
      const user = (await prisma[userModelName].findUnique({
        where: { [pkField]: userIdValue },
      })) as InferTableType<AuthOptions['schema']['user']>

      if (!user) throw new Error('User not found')

      return user
    },

    async deleteByToken(token: string) {
      const modelName = options.schema.session.config.prismaModelName
      const tokenField = options.schema.session.shape.columns.token.name
      await prisma[modelName].delete({ where: { [tokenField]: token } })
    },

    async deleteByUserId(userId: string) {
      const modelName = options.schema.session.config.prismaModelName
      const userIdField = options.schema.session.shape.columns.userId.name
      await prisma[modelName].delete({ where: { [userIdField]: userId } })
    },
  }

  const verification = {
    async create(data: { identifier: string; value: string; expiredAt: Date }) {
      const modelName = options.schema.verification.config.prismaModelName
      const identifierField = options.schema.verification.shape.columns.identifier.name
      const valueField = options.schema.verification.shape.columns.value.name
      const expiredAtField = options.schema.verification.shape.columns.expiredAt.name

      const verification = await prisma[modelName].create({
        data: {
          [identifierField]: data.identifier,
          [valueField]: data.value,
          [expiredAtField]: data.expiredAt,
        },
      })

      return verification
    },

    findByIdentifier: async (identifier: string) => {
      const modelName = options.schema.verification.config.prismaModelName
      const identifierField = options.schema.verification.shape.columns.identifier.name
      const createdAtField = options.schema.verification.shape.columns.createdAt.name
      const verification = await prisma[modelName].findFirst({
        where: { [identifierField]: identifier },
        orderBy: { [createdAtField]: 'desc' },
      })
      if (!verification) throw new Error('Verification not found')
      return verification
    },

    async deleteByIdentifier(identifier: string) {
      const modelName = options.schema.verification.config.prismaModelName
      const identifierField = options.schema.verification.shape.columns.identifier.name
      const verification = await prisma[modelName].delete({
        where: { [identifierField]: identifier },
      })
      if (!verification) throw new Error('Verification not found')
      return verification
    },

    async deleteByUserIdAndIdentifierPrefix(userId: string, identifierPrefix: string) {
      const modelName = options.schema.verification.config.prismaModelName
      const userIdField = options.schema.verification.shape.columns.value.name
      const identifierField = options.schema.verification.shape.columns.identifier.name
      const verification = await prisma[modelName].deleteMany({
        where: {
          [userIdField]: userId,
          [identifierField]: {
            startsWith: identifierPrefix,
          },
        },
      })
      if (verification.count === 0) throw new Error('Verification not found')
      return verification
    },
  }

  return {
    user,
    account,
    session,
    verification,

    identifier: {
      resetPassword: (token: string) => `reset-password:${token}`,
      emailVerification: (token: string) => `email-verification:${token}`,
      emailChange: (token: string) => `email-change:${token}`,
    },

    identityPrefix: {
      resetPassword: 'reset-password:',
      emailVerification: 'email-verification:',
      emailChange: 'email-change:',
    },
  }
}

export type AuthInternalHandler = ReturnType<typeof createAuthInternalHandler>
