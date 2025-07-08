import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { z } from 'zod/v4'

import type {
  AnyAccountTable,
  AnyContextable,
  AnySessionTable,
  AnyTypedColumn,
  AnyVerificationTable,
  WithAnyTable,
} from '@genseki/react'
import type { AnyUserTable as BaseAnyUserTable } from '@genseki/react'
import {
  AccountProvider,
  Builder,
  createPlugin,
  hashPassword,
  setSessionCookie,
  verifyPassword,
  type WithAnyRelations,
} from '@genseki/react'

export interface OtpRequestResponse {
  status: string
  token: string
  refno: string
}

type AnyUserTable = WithAnyTable<
  {
    phone: AnyTypedColumn<string>
    phoneVerified: AnyTypedColumn<boolean>
  },
  'user'
> &
  BaseAnyUserTable

type FullSchema = WithAnyRelations<{
  user: AnyUserTable
  account: AnyAccountTable
  session: AnySessionTable
  verification: AnyVerificationTable
}>

// TODO: TFullSchema should be Generic but it is not working with the current setup
export function phone<TContext extends AnyContextable>({
  db,
  schema,
  sendOtp,
  verifyOtp,
  signUpOnVerification,
  options,
}: {
  db: NodePgDatabase<FullSchema>
  schema: FullSchema
  context: TContext
  sendOtp?: (phone: string) => Promise<OtpRequestResponse>
  verifyOtp?: (args: { token: string; pin: string }) => Promise<boolean>
  signUpOnVerification?: {
    getTempEmail?: (phoneNumber: string) => string
    getTempName?: (phoneNumber: string) => string
  }
  options?: {
    autoLogin?: boolean
    passwordHasher?: (passowrd: string) => Promise<string> | string
  }
}) {
  const builder = new Builder({ db: db, schema: schema }).$context<TContext>()

  const internalHandlers = {
    account: {
      findByUserPhoneAndProvider: async (email: string, providerId: string) => {
        const accounts = await db
          .select({
            user: schema.user,
            password: schema.account.password,
          })
          .from(schema.account)
          .leftJoin(schema.user, eq(schema.account.userId, schema.user.id))
          .where(and(eq(schema.user.email, email), eq(schema.account.providerId, providerId)))
        if (accounts.length === 0) throw new Error('Account not found')
        if (accounts.length > 1) throw new Error('Multiple accounts found')
        return accounts[0]
      },
      link: async (data: any) => {
        const user = await db.insert(schema.account).values(data).returning()
        return user[0]
      },
    },
    session: {
      create: async (data: { userId: string; expiresAt: Date }) => {
        const table = schema.session
        const token = crypto.randomUUID()
        const session = await db
          .insert(table)
          .values({ ...data, token })
          .returning()
        return session[0]
      },
    },
    user: {
      create: async (data: any) => {
        const user = await db.insert(schema.user).values(data).returning()
        return user[0]
      },
    },
  }

  const loginByPhoneNumberEndpoint = builder.endpoint(
    {
      method: 'POST',
      path: '/auth/login/phone',
      body: z.object({
        phone: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.object({
          token: z.string().nullable(),
          user: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string().nullable().optional(),
            phone: z.string().nullable().optional(),
            phoneVerified: z.boolean().nullable().optional(),
            image: z.string().nullable().optional(),
          }),
        }),
      },
    },
    async ({ body }) => {
      const account = await internalHandlers.account.findByUserPhoneAndProvider(
        body.phone,
        AccountProvider.CREDENTIAL
      )

      if (!account.user) {
        throw new Error('User not found')
      }

      const verifyStatus = await verifyPassword(body.password, account.password as string)
      if (!verifyStatus) {
        throw new Error('Invalid password')
      }

      const session = await internalHandlers.session.create({
        userId: account.user.id,
        // TODO: Customize expiresAt
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })

      const responseHeaders = {}
      setSessionCookie(responseHeaders, session.token)

      return {
        status: 200 as const,
        body: {
          token: session.token,
          user: {
            id: account.user.id,
            name: account.user.name,
            phone: account.user.phone,
            phoneVerified: account.user.phoneVerified,
            email: account.user.email,
            image: account.user.image,
          },
        },
        headers: responseHeaders,
      }
    }
  )

  const signUpPhoneEndpoint = builder.endpoint(
    {
      method: 'POST',
      path: '/api/auth/sign-up/phone',
      body: z
        .object({
          phone: z.string(),
          // TODO: Customize password validation
          password: z.string().min(6, { error: 'Password must be at least 6 characters' }),
          name: z.string().nullable().optional(),
          email: z.email().nullable().optional(),
        })
        .and(z.record(z.string(), z.any())),
      responses: {
        200: z.object({
          token: z.string().nullable(),
          user: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            phone: z.string().nullable().optional(),
            image: z.string().nullable(),
          }),
        }),
      },
    },
    async ({ body }) => {
      const hashedPassword =
        (await options?.passwordHasher?.(body.password)) ?? (await hashPassword(body.password))

      const name = body.name ?? signUpOnVerification?.getTempName?.(body.phone) ?? body.phone
      const email =
        body.email ?? signUpOnVerification?.getTempEmail?.(body.phone) ?? `${body.phone}@gmail.com`

      const user = await internalHandlers.user.create({
        name: name,
        email: email,
        emailVerified: false,
        phone: body.phone,
        phoneVerified: false,
      })

      await internalHandlers.account.link({
        userId: user.id,
        providerId: AccountProvider.CREDENTIAL,
        accountId: user.id,
        password: hashedPassword,
      })

      // TODO: Check if sending email verification is enabled
      // NOTE: Callback URL is used for email verification

      // Check if auto login is enabled

      const responseHeaders = {}
      if (options?.autoLogin !== false) {
        const session = await internalHandlers.session.create({
          userId: user.id,
          // TODO: Customize expiresAt
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        })

        // Set session cookie if auto login is enabled
        setSessionCookie(responseHeaders, session.token)

        return {
          status: 200,
          body: {
            token: session.token,
            user: user,
          },
          headers: responseHeaders,
        }
      }

      return {
        status: 200,
        body: {
          token: null,
          user: user,
        },
        headers: responseHeaders,
      }
    }
  )

  const sendPhoneVerificationOtpEndpoint = builder.endpoint(
    {
      method: 'POST',
      path: '/auth/verification/otp/phone',
      body: z.any(),
      responses: {
        200: z.object({
          success: z.boolean(),
          refCode: z.string(),
          token: z.string(),
        }),
        400: z.object({
          success: z.boolean(),
          error: z.string(),
        }),
      },
    },
    async ({ context, body }) => {
      // TODO: Fix type
      const user = (await context.requiredAuthenticated()) as { id: string; phone?: string }

      if (!user.phone) {
        return {
          status: 400 as const,
          body: { success: false, error: 'Phone number is required in user profile' },
        }
      }

      const phone = user.phone

      if (!sendOtp) {
        return {
          status: 400 as const,
          body: {
            success: false,
            error: 'OTP sending function is not implemented',
          },
        }
      }

      const otpRequestResponse = await sendOtp(phone)

      const refCode = otpRequestResponse.refno
      const token = otpRequestResponse.token

      await db.insert(schema.verification).values({
        identifier: `verify-phone:${refCode}:${token}`,
        value: user.id,
        // TODO: Customize expiresAt
        expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes expiration
      })

      return {
        status: 200 as const,
        body: {
          success: true,
          refCode: otpRequestResponse.refno,
          token: otpRequestResponse.token,
        },
      }
    }
  )

  const verifyPhoneVerificationEndpoint = builder.endpoint(
    {
      method: 'POST',
      path: '/auth/verification/verify/phone',
      body: z.object({
        pin: z.string().min(1, 'Pin is required'),
        token: z.string().min(1, 'Token is required'),
      }),
      responses: {
        200: z.object({
          success: z.boolean(),
        }),
        400: z.object({
          success: z.boolean(),
          error: z.string(),
        }),
      },
    },
    async ({ context, body }) => {
      if (!verifyOtp) {
        return {
          status: 400 as const,
          body: {
            success: false,
            error: 'OTP verification function is not implemented',
          },
        }
      }

      // Check if the user is authenticated
      const user = (await context.requiredAuthenticated()) as { id: string }

      const verification = await db
        .select()
        .from(schema.verification)
        .where(and(eq(schema.verification.identifier, `verify-phone:${body.token}`)))

      if (verification.length === 0) {
        return {
          status: 400 as const,
          body: {
            success: false,
            error: 'Invalid token',
          },
        }
      }

      if (!verification[0].value || verification[0].value !== user.id) {
        // If the user ID from the verification does not match the authenticated user ID
        return {
          status: 400 as const,
          body: {
            success: false,
            error: 'Verification does not match the authenticated user',
          },
        }
      }

      const otpVerificationStatus = await verifyOtp(body)
      if (!otpVerificationStatus) {
        return {
          status: 400 as const,
          body: {
            success: false,
            error: 'Invalid OTP or token',
          },
        }
      }

      await db.update(schema.user).set({ phoneVerified: true }).where(eq(schema.user.id, user.id))

      return {
        status: 200 as const,
        body: {
          success: true,
        },
      }
    }
  )

  return createPlugin({
    name: 'phone',
    plugin: (input) => {
      return {
        ...input,
        endpoints: {
          ...input.endpoints,
          'auth.login-phone': loginByPhoneNumberEndpoint,
          'auth.sign-up-phone': signUpPhoneEndpoint,
          'auth.verification-otp-phone': sendPhoneVerificationOtpEndpoint,
          'auth.verification-otp-verify-phone': verifyPhoneVerificationEndpoint,
        },
      }
    },
  })
}
