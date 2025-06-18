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
import { Builder, createPlugin } from '@genseki/react'

import { AccountProvider } from '../../../react/src/auth/constant'
import { hashPassword, setSessionCookie, verifyPassword } from '../../../react/src/auth/utils'

type AnyUserTable = WithAnyTable<
  {
    phone: AnyTypedColumn<string>
    phoneVerified: AnyTypedColumn<boolean>
  },
  'user'
> &
  BaseAnyUserTable

// TODO: TFullSchema should be Generic but it is not working with the current setup
export function phone<
  TContext extends Context<{
    user: AnyUserTable
    account: AnyAccountTable
    session: AnySessionTable
  }>,
>({
  baseConfig,
  sendOtp,
  verifyOtp,
  signUpOnVerification,
}: {
  baseConfig: BaseConfig<
    { user: AnyUserTable; account: AnyAccountTable; session: AnySessionTable },
    TContext
  >
  sendOtp?: (phone: string) => Promise<void>
  verifyOtp?: (token: string, otp: string) => Promise<boolean>

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
          user: userModel,
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

      // Ensure user is not null and matches the expected response shape
      const user = account.user
      if (!user) {
        throw new Error('User not found')
      }

      return {
        status: 200 as const,
        body: {
          token: session.token,
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            phoneVerified: user.phoneVerified,
            email: user.email ?? null,
            image: user.image ?? null,
          },
        },
        headers: responseHeaders,
      }
    }
  )

  const signupByPhoneNumberEndpoint = builder.endpoint(
    {
      method: 'POST',
      path: '/auth/phone/signup',
      body: z.object(userModel),
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
      const { phone, name, email, password } = body

      const hashedPassword =
        (await baseConfig.auth.emailAndPassword?.passwordHasher?.(password)) ??
        (await hashPassword(password))
    }
  )

  return createPlugin({
    name: 'admin',
    plugin: (input) => {
      return {
        ...input,
        endpoints: {
          ...input.endpoints,
          'auth.phone.login': loginByPhoneNumberEndpoint,
        },
      }
    },
  })
}
