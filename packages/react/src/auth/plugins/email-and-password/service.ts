import { type EmailAndPasswordPluginOptionsWithDefaults, type PluginSchema } from '.'
import { AccountProvider } from './constant'
import { Password } from './utils'

import type { AnyContextable } from '../../../core/context'
import { HttpInternalServerError } from '../../../core/error'
import type { MockPrismaClient } from '../../../core/prisma.types'
import type { InferTableType } from '../../../core/table'
import type { AnyAccountTable, AnyUserTable, AnyVerificationTable } from '../../base'

export class EmailAndPasswordService<TContext extends AnyContextable> {
  private readonly prisma: MockPrismaClient

  constructor(
    public readonly context: TContext,
    public readonly schema: PluginSchema,
    public readonly options: EmailAndPasswordPluginOptionsWithDefaults
  ) {
    this.prisma = context.getPrismaClient()
  }

  async userCounts() {
    const modelName = this.schema.user.config.prismaModelName
    return this.prisma[modelName].count()
  }

  async loginWithEmail(email: string, password: string) {
    const modelName = this.schema.user.config.prismaModelName
    const emailField = this.schema.user.shape.columns.email

    const user = (await this.prisma[modelName].findFirst({
      where: {
        [emailField.name]: email,
      },
    })) as InferTableType<AnyUserTable> | undefined

    if (!user) throw new HttpInternalServerError('User not found')

    const account = (await this.prisma[this.schema.account.config.prismaModelName].findFirst({
      where: { accountId: user.id, provider: AccountProvider.CREDENTIAL },
    })) as InferTableType<AnyAccountTable> | undefined

    if (!account) throw new HttpInternalServerError('Account not found')
    if (!account.password)
      throw new HttpInternalServerError('This account does not support password login')

    const status = Password.verifyPassword(password, account.password)
    if (!status) throw new HttpInternalServerError('Invalid email or password')

    return user.id
  }

  async createSession(data: { userId: string; expiredAt?: Date }) {
    const userIdField = this.schema.session.shape.columns.userId
    const tokenField = this.schema.session.shape.columns.token
    const expiredAtField = this.schema.session.shape.columns.expiredAt
    // const ipAddressField = this.schema.session.shape.columns.ipAddress
    // const userAgentField = this.schema.session.shape.columns.userAgent
    const sessionToken = crypto.randomUUID()
    const expiredAt = data.expiredAt ?? new Date(Date.now() + this.options.login.sessionExpiredInMs)

    await this.prisma[this.schema.session.config.prismaModelName].create({
      data: {
        [userIdField.name]: data.userId,
        [expiredAtField.name]: expiredAt,
        [tokenField.name]: sessionToken,
        // TODO: Set real IP address and user agent
        // [ipAddressField.name]: '', // TODO: Get real IP address
        // [userAgentField.name]: '', // TODO: Get real user agent
      },
    })

    return { sessionToken, expiredAt }
  }

  async deleteSessionByToken(token: string) {
    await this.prisma[this.schema.session.config.prismaModelName].delete({
      where: { token: token },
    })
    return true
  }

  async requestResetPassword(email: string) {
    const emailField = this.schema.user.shape.columns.email
    const user = (await this.prisma[this.schema.user.config.prismaModelName].findUnique({
      where: { [emailField.name]: email },
    })) as InferTableType<AnyUserTable> | undefined

    if (!user) {
      throw new HttpInternalServerError('User not found')
    }

    const token = crypto.randomUUID()
    const identifier = Identifier.resetPassword(token)

    // Deactivate existing reset password tokens for this user. Set expiredAt to now
    const identifierField = this.schema.verification.shape.columns.identifier
    const valueField = this.schema.verification.shape.columns.value
    const userIdField = this.schema.verification.shape.columns.userId
    const expiredAtField = this.schema.verification.shape.columns.expiredAt

    await this.prisma[this.schema.verification.config.prismaModelName].updateMany({
      where: {
        [identifierField.name]: { contains: identifier.prefix },
        [userIdField.name]: user.id,
      },
      data: { [expiredAtField.name]: new Date() },
    })

    // Create a new reset password verification token
    const expiredAt = new Date(Date.now() + this.options.resetPassword.expiredInMs)
    await this.prisma[this.schema.verification.config.prismaModelName].create({
      data: {
        [userIdField.name]: user.id,
        [valueField.name]: user.id,
        [identifierField.name]: identifier.value,
        [expiredAtField.name]: expiredAt,
      },
    })

    return { token, expiredAt, email: user.email! }
  }

  async validateResetPasswordToken(token: string) {
    const identifier = Identifier.resetPassword(token)

    const identifierField = this.schema.verification.shape.columns.identifier
    const verification = (await this.prisma[
      this.schema.verification.config.prismaModelName
    ].findUnique({
      where: { [identifierField.name]: identifier.value },
    })) as InferTableType<AnyVerificationTable> | undefined

    if (!verification || verification.expiredAt < new Date()) {
      throw new HttpInternalServerError('Reset password token not found or expired')
    }

    return verification
  }

  async consumeResetPasswordToken(payload: {
    userId: string
    verificationId: string
    rawPassword: string
  }) {
    const hashedPassword = await this.options.passwordHasher(payload.rawPassword)

    await this.prisma.$transaction(async (tx) => {
      const accountModelName = this.schema.account.config.prismaModelName
      const accountUserIdField = this.schema.account.shape.columns.userId
      const accountPasswordField = this.schema.account.shape.columns.password
      const accountProviderField = this.schema.account.shape.columns.provider
      const uniqueFieldName = `${accountUserIdField.name}_provider`

      await tx[accountModelName].update({
        where: {
          [uniqueFieldName]: {
            [accountUserIdField.name]: payload.userId,
            [accountProviderField.name]: AccountProvider.CREDENTIAL,
          },
        },
        data: { [accountPasswordField.name]: hashedPassword },
      })

      const verificationModelName = this.schema.verification.config.prismaModelName
      const verificationIdField = this.schema.verification.shape.columns.id
      await tx[verificationModelName].delete({
        where: { [verificationIdField.name]: payload.verificationId },
      })
    })
  }
}

abstract class Identifier {
  static resetPassword(token: string) {
    return {
      prefix: `reset-password`,
      value: `reset-password:${token}`,
    }
  }
}
