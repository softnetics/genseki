import { and, eq } from 'drizzle-orm'
import { z } from 'zod/v4'

import type {
  AnyAccountTable,
  AnySessionTable,
  AnyTypedColumn,
  BaseConfig,
  Context,
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
}>

// TODO: TFullSchema should be Generic but it is not working with the current setup
export function phone<TContext extends Context<FullSchema>>({
  baseConfig,
  sendOtp,
  verifyOtp,
  signUpOnVerification,
}: {
  baseConfig: BaseConfig<FullSchema, TContext>
  sendOtp?: (phone: string) => Promise<OtpRequestResponse>
  verifyOtp?: (token: string, pin: string) => Promise<boolean>

  signUpOnVerification?: {
    getTempEmail?: (phoneNumber: string) => string
    getTempName?: (phoneNumber: string) => string
  }
}) {
  const schema = baseConfig.schema
  const builder = new Builder({ schema: baseConfig.schema }).$context<typeof baseConfig.context>()
  const userModel = baseConfig.schema.user

  const loginByPhoneNumberEndpoint = builder.endpoint(
    {
      method: 'POST',
      path: '/auth/phone/login',
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
    async ({ body, context }) => {
      const { phone, password } = body

      const accounts = await context.db
        .select({
          user: schema.user,
          password: baseConfig.auth.account.model.password,
        })
        .from(baseConfig.auth.account.model)
        .leftJoin(
          baseConfig.auth.user.model,
          eq(baseConfig.auth.account.model.userId, baseConfig.auth.user.model.id)
        )
        .where(
          and(
            eq(userModel.phone, phone),
            eq(baseConfig.auth.account.model.providerId, AccountProvider.CREDENTIAL)
          )
        )

      const account = accounts[0]

      // Ensure user is not null and matches the expected response shape
      const user = account.user
      if (!user) {
        throw new Error('User not found')
      }

      const verifyStatus = await verifyPassword(password, accounts[0].password as string)

      if (!verifyStatus) {
        throw new Error('Invalid password')
      }

      const table = schema.session
      const token = crypto.randomUUID()
      const sessions = await context.db
        .insert(table)
        .values({
          userId: accounts[0].user?.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          token,
        })
        .returning()

      const session = sessions[0]

      const responseHeaders = {}
      setSessionCookie(responseHeaders, session.token)

      return {
        status: 200 as const,
        body: {
          token: session.token,
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            phoneVerified: user.phoneVerified,
            email: user.email,
            image: user.image,
          },
        },
        headers: responseHeaders,
      }
    }
  )

  const sendOtpEndpoint = builder.endpoint(
    {
      method: 'POST',
      path: '/auth/phone/otp/send',
      body: z.object({
        phone: z.string(),
      }),
      responses: {
        200: z.object({
          success: z.boolean(),
          otpData: z.object({
            status: z.string(),
            token: z.string(),
            refno: z.string(),
          }),
        }),
        400: z.object({
          success: z.boolean(),
          error: z.string(),
        }),
      },
    },
    async ({ body, context }) => {
      const { phone } = body

      if (!phone) {
        return {
          status: 400 as const,
          body: {
            success: false,
            error: 'Phone number is required',
          },
        }
      }

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

      return {
        status: 200 as const,
        body: {
          success: true,
          otpData: otpRequestResponse,
        },
      }
    }
  )

  const confirmOtpSignupByPhoneNumberEndpoint = builder.endpoint(
    {
      method: 'POST',
      path: '/auth/phone/signup',
      body: z
        .object
        // add base user model properties
        ()
        .extend({
          phone: z.string(),
          name: z.string(),
          email: z.string().email().nullable().optional(),
          image: z.string().nullable().optional(),
          token: z.string(),
          pin: z.string(),
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
        400: z.object({
          success: z.boolean(),
          error: z.string(),
        }),
      },
    },
    async ({ body, context }) => {
      const { phone, name, email, image, pin, token, password, ...rest } = body

      const hashedPassword =
        (await baseConfig.auth.emailAndPassword?.passwordHasher?.(password)) ??
        (await hashPassword(password))

      if (!verifyOtp) {
        return {
          status: 400 as const,
          body: {
            success: false,
            error: 'OTP verification function is not implemented',
          },
        }
      }

      const otpVerificationStatus = await verifyOtp(token, pin)

      if (!otpVerificationStatus) {
        return {
          status: 400 as const,
          body: {
            success: false,
            error: 'Invalid OTP',
          },
        }
      }

      const users = await context.db
        .insert(userModel)
        .values({
          ...rest,
          phone,
          email: email ?? signUpOnVerification?.getTempEmail?.(phone) ?? null,
          name: name ?? signUpOnVerification?.getTempName?.(phone) ?? null,
          image: image ?? null,
          phoneVerified: true,
        })
        .returning()

      const user = users[0]

      const session = await context.db
        .insert(baseConfig.auth.session.model)
        .values({
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          token: crypto.randomUUID(),
        })
        .returning()

      const responseHeaders = {}
      if (baseConfig.auth.emailAndPassword?.signUp?.autoLogin !== false) {
        // Set session cookie if auto login is enabled
        setSessionCookie(responseHeaders, session[0].token)
      }

      return {
        status: 200 as const,
        body: {
          token: session[0].token,
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            phoneVerified: user.phoneVerified,
            email: user.email,
            image: user.image,
          },
        },
        headers: responseHeaders,
      }
    }
  )

  const otpVerifyEndpoint = builder.endpoint(
    {
      method: 'POST',
      path: '/auth/phone/verify',
      body: z.object({
        token: z.string(),
        pin: z.string(),
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
    async ({ body, context }) => {
      const { token, pin } = body

      if (!verifyOtp) {
        return {
          status: 400 as const,
          body: {
            success: false,
            error: 'OTP verification function is not implemented',
          },
        }
      }

      const otpVerificationStatus = await verifyOtp(token, pin)

      if (!otpVerificationStatus) {
        return {
          status: 400 as const,
          body: {
            success: false,
            error: 'Invalid OTP',
          },
        }
      }

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
          'auth.sign-up.phone': confirmOtpSignupByPhoneNumberEndpoint,
          'auth.phone-otp-send': sendOtpEndpoint,
          'auth.phone-otp-verify': otpVerifyEndpoint,
        },
      }
    },
  })
}
