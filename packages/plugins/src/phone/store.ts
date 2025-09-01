import type z from 'zod'

import {
  AccountProvider,
  type AnyAccountTable,
  type InferTableType,
  type MockPrismaClient,
} from '@genseki/react'

import { safeJsonParse } from './helper'
import type { BaseSignUpBody, BaseSignUpBodySchema, PluginSchema } from './types'

interface SignUpVerificationPayload<TSignUpBody extends BaseSignUpBody = BaseSignUpBody> {
  phone: string
  password: string
  attempt: number
  data: TSignUpBody
}

interface ChangePhoneNumberVerificationPayload {
  userId: string
  newPhone: string
  oldPhone: string
  attempt: number
}

interface ForgotPasswordVerificationPayload {
  phone: string
  attempt: number
  userId: string
}

interface ResetPasswordVerificationPayload {
  accountId: string
}

export abstract class PhoneStore<TSignUpBodySchema extends BaseSignUpBodySchema> {
  constructor(private readonly prisma: MockPrismaClient) {}

  // Abstract method, user need to implement the method by themself.
  async createUser(data: z.output<TSignUpBodySchema>) {
    const user = (await this.prisma.user.create({
      select: { id: true },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
      },
    })) as { id: string }

    return user.id
  }

  async generateRefCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, (x) => chars[x % chars.length]).join('')
  }

  async checkIfUserExists(data: z.output<TSignUpBodySchema>): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { phone: data.phone },
    })
    return user !== null
  }

  async getUserByPhone(phone: string) {
    const user = await this.prisma.user.findUnique({
      where: { phone: phone },
    })
    return user as InferTableType<PluginSchema['user']> | null
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })
    return user as InferTableType<PluginSchema['user']> | null
  }

  async getAccountById(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: id },
    })
    return account as InferTableType<AnyAccountTable> | null
  }

  async getAccountByUserId(userId: string) {
    const accounts = await this.prisma.account.findMany({
      where: { userId: userId },
    })
    return accounts as InferTableType<AnyAccountTable>[]
  }

  async getCredentialAccountIdByUserId(userId: string) {
    const account = await this.prisma.account.findFirst({
      select: { id: true },
      where: { userId: userId, provider: AccountProvider.CREDENTIAL },
    })
    return account?.id as string | null | undefined
  }

  async createAccount(userId: string, hashedPassword: string) {
    await this.prisma.account.create({
      select: { id: true },
      data: {
        userId: userId,
        accountId: userId,
        provider: AccountProvider.CREDENTIAL,
        password: hashedPassword,
      },
    })
  }

  async createSession(userId: string): Promise<{ id: string; token: string; expiredAt: Date }> {
    const token = crypto.randomUUID()

    const session: { id: string; token: string; expiredAt: Date } =
      await this.prisma.session.create({
        select: { id: true, token: true, expiredAt: true },
        data: {
          token: token,
          user: { connect: { id: userId } },
          expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours expiration
        },
      })

    return session
  }

  // Sign up

  async getSignUpVerification(phone: string, refCode: string) {
    const verification = await this.prisma.verification.findFirst({
      select: { id: true, value: true },
      where: {
        identifier: `sign-up-phone:${phone}:${refCode}`,
        expiredAt: { gte: new Date() },
      },
    })

    if (!verification) {
      return null
    }

    const value = safeJsonParse<SignUpVerificationPayload<z.output<TSignUpBodySchema>>>(
      verification.value
    )

    if (!value) {
      return null
    }

    return {
      id: verification.id,
      value: value,
    }
  }

  async countActiveSignUpVerifications(phone: string): Promise<number> {
    const count = await this.prisma.verification.count({
      where: { identifier: { contains: `sign-up-phone:${phone}` }, expiredAt: { gte: new Date() } },
    })
    return count
  }

  async createSignUpVerification(data: {
    id: string
    refCode: string
    value: SignUpVerificationPayload<z.output<TSignUpBodySchema>>
    expiredAt: Date
  }) {
    await this.prisma.verification.create({
      data: {
        id: data.id,
        identifier: `sign-up-phone:${data.value.phone}:${data.refCode}`,
        value: JSON.stringify(data.value),
        expiredAt: data.expiredAt,
      },
    })
  }

  async increaseSignUpVerificationAttempt(phone: string, refCode: string) {
    const verification = await this.getSignUpVerification(phone, refCode)

    if (!verification) {
      throw new Error('Verification not found')
    }

    const attempt = verification.value.attempt + 1

    await this.prisma.verification.update({
      where: { id: verification.id },
      data: {
        value: JSON.stringify({ ...verification.value, attempt: attempt }),
      },
    })

    return attempt
  }

  // Change phone number

  async createChangePhoneNumberVerification(data: {
    id: string
    refCode: string
    value: ChangePhoneNumberVerificationPayload
    expiredAt: Date
  }) {
    await this.prisma.verification.create({
      data: {
        id: data.id,
        identifier: `change-phone:${data.value.oldPhone}:${data.refCode}`,
        value: JSON.stringify(data.value),
        expiredAt: data.expiredAt,
      },
    })
  }

  async increaseChangePhoneNumberVerificationAttempt(userId: string, refCode: string) {
    const verification = await this.getChangePhoneNumberVerification(userId, refCode)

    if (!verification) {
      throw new Error('Verification not found')
    }

    const attempt = verification.value.attempt + 1

    await this.prisma.verification.update({
      where: { id: verification.id },
      data: {
        value: JSON.stringify({ ...verification.value, attempt: attempt }),
      },
    })

    return attempt
  }

  async countActiveChangePhoneNumberVerification(phone: string) {
    const count = await this.prisma.verification.count({
      where: {
        identifier: { contains: `change-phone:${phone}` },
        expiredAt: { gte: new Date() },
      },
    })
    return count
  }

  async getChangePhoneNumberVerification(userId: string, refCode: string) {
    const verification = await this.prisma.verification.findFirst({
      select: { id: true, value: true },
      where: {
        identifier: `change-phone:${userId}:${refCode}`,
        expiredAt: { gte: new Date() },
      },
    })

    if (!verification) {
      return null
    }

    const value = safeJsonParse<ChangePhoneNumberVerificationPayload>(verification.value)

    if (!value) {
      return null
    }

    return {
      id: verification.id as string,
      value: value,
    }
  }

  async getLatestPhoneNumberVerification(userId: string) {
    const verification = await this.prisma.verification.findFirst({
      select: { id: true, value: true },
      where: {
        identifier: { contains: `change-phone:${userId}` },
        expiredAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!verification) {
      return null
    }

    const value = safeJsonParse<ChangePhoneNumberVerificationPayload>(verification.value)

    if (!value) {
      return null
    }

    return {
      id: verification.id as string,
      value: value,
    }
  }

  async updatePhoneNumber(userId: string, newPhone: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { phone: newPhone, phoneVerified: true },
    })
  }

  // Forgot password

  async countActiveForgotPasswordVerifications(phone: string) {
    const count = await this.prisma.verification.count({
      where: {
        identifier: { contains: `forgot-password:${phone}` },
        expiredAt: { gte: new Date() },
      },
    })
    return count
  }

  async createForgotPasswordVerification(data: {
    id?: string
    refCode: string
    value: ForgotPasswordVerificationPayload
    expiredAt: Date
  }) {
    const { id } = (await this.prisma.verification.create({
      select: { id: true },
      data: {
        id: data.id,
        identifier: `forgot-password:${data.value.phone}:${data.refCode}`,
        value: JSON.stringify(data.value),
        expiredAt: data.expiredAt,
      },
    })) as { id: string }
    return id
  }

  async getForgotPasswordVerification(phone: string, refCode: string) {
    const verification = (await this.prisma.verification.findFirst({
      select: { id: true, value: true, createdAt: true },
      where: {
        identifier: `forgot-password:${phone}:${refCode}`,
        expiredAt: { gte: new Date() },
      },
    })) as { id: string; value: string; createdAt: Date } | null

    if (!verification) {
      return null
    }

    const value = safeJsonParse<ForgotPasswordVerificationPayload>(verification.value)

    if (!value) {
      return null
    }

    return {
      id: verification.id,
      value: value,
      createdAt: verification.createdAt,
    }
  }

  async createResetPasswordVerification(data: {
    value: ResetPasswordVerificationPayload
    expiredAt: Date
  }) {
    const { id } = (await this.prisma.verification.upsert({
      select: { id: true },
      where: {
        identifier: `reset-password:${data.value.accountId}`,
      },
      create: {
        value: JSON.stringify(data.value),
        expiredAt: data.expiredAt,
      },
      update: {
        value: JSON.stringify(data.value),
        expiredAt: data.expiredAt,
      },
    })) as { id: string }
    return id
  }

  async getResetPasswordVerification(token: string) {
    const verification = (await this.prisma.verification.findFirst({
      select: { id: true, value: true },
      where: { id: token, expiredAt: { gte: new Date() } },
    })) as { id: string; value: string } | null

    if (!verification) {
      return null
    }

    const value = safeJsonParse<ResetPasswordVerificationPayload>(verification.value)

    if (!value) {
      return null
    }

    return {
      id: verification.id,
      value: value,
    }
  }

  async updateAccountPassword(accountId: string, hashedPassword: string) {
    await this.prisma.account.update({
      where: { id: accountId, provider: AccountProvider.CREDENTIAL },
      data: { password: hashedPassword },
    })
  }

  async deleteResetPasswordVerification(accountId: string) {
    await this.prisma.verification.deleteMany({
      where: { identifier: `reset-password:${accountId}` },
    })
  }

  async increaseForgotPasswordVerificationAttempt(phone: string, refCode: string) {
    const verification = await this.getForgotPasswordVerification(phone, refCode)

    if (!verification) {
      throw new Error('Verification not found')
    }

    const attempt = verification.value.attempt + 1

    await this.prisma.verification.update({
      where: { id: verification.id },
      data: {
        value: JSON.stringify({ ...verification.value, attempt }),
      },
    })

    return attempt
  }
}
