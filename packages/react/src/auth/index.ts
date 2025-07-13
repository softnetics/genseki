import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { forgotPasswordEmail } from './api/forgot-password'
import { loginEmail } from './api/login-email'
import { me } from './api/me'
import { resetPasswordEmail, validateResetToken } from './api/reset-password-email'
import { sendResetPasswordEmail } from './api/send-email-reset-password'
import { signOut } from './api/sign-out'
import { signUpEmail } from './api/sign-up-email'
import { type AuthInternalHandler, createAuthInternalHandler } from './context'

import { type GensekiCore } from '../core/config'
import { type Contextable } from '../core/context'
import type { Fields } from '../core/field'
import type { AnyTypedColumn, WithAnyTable, WithHasDefault, WithNotNull } from '../core/table'

export * from './constant'
export * from './utils'

export type AnyUserTable = WithAnyTable<{
  id: WithHasDefault<WithNotNull<AnyTypedColumn<string>>>
  name: WithNotNull<AnyTypedColumn<string>>
  email: WithNotNull<AnyTypedColumn<string>>
  emailVerified: WithNotNull<AnyTypedColumn<boolean>>
  image: AnyTypedColumn<string>
}>

export type AnySessionTable = WithAnyTable<{
  id: WithHasDefault<WithNotNull<AnyTypedColumn<string>>>
  expiresAt: WithNotNull<AnyTypedColumn<Date>>
  token: WithNotNull<AnyTypedColumn<string>>
  ipAddress: AnyTypedColumn<string>
  userAgent: AnyTypedColumn<string>
  userId: WithNotNull<AnyTypedColumn<string>>
}>

export type AnyAccountTable = WithAnyTable<{
  id: WithHasDefault<WithNotNull<AnyTypedColumn<string>>>
  accountId: WithNotNull<AnyTypedColumn<string>>
  providerId: WithNotNull<AnyTypedColumn<string>>
  userId: WithNotNull<AnyTypedColumn<string>>
  accessToken: AnyTypedColumn<string>
  refreshToken: AnyTypedColumn<string>
  idToken: AnyTypedColumn<string>
  accessTokenExpiresAt: AnyTypedColumn<Date>
  refreshTokenExpiresAt: AnyTypedColumn<Date>
  scope: AnyTypedColumn<string>
  password: AnyTypedColumn<string>
}>

export type AnyVerificationTable = WithAnyTable<{
  id: WithHasDefault<WithNotNull<AnyTypedColumn<string>>>
  identifier: WithNotNull<AnyTypedColumn<string>>
  value: AnyTypedColumn<string>
  expiresAt: WithNotNull<AnyTypedColumn<Date>>
}>

export interface AuthOptions {
  db: NodePgDatabase
  schema: {
    user: AnyUserTable
    session: AnySessionTable
    account: AnyAccountTable
    verification: AnyVerificationTable
  }

  /**
   * TODO: Implemnet authentication methods as a auth plugin e.g.
   * ```typescript
   * auth: {
   *    methods: [
   *      emailAndPassword({ ... }),
   *      googleOAuth2({ ... }),
   *      phoneAndPassword({ ... }),
   *    ]
   * }
   */
  method: {
    emailAndPassword?: {
      enabled: boolean
      passwordHasher?: (password: string) => Promise<string> // default: scrypt
      signUp?: {
        autoLogin?: boolean // default: true
        additionalFields?: Fields
      }
      resetPassword?: {
        enabled?: boolean // default: false
        expiresInMs?: number // default: 1 day (1000 * 60 * 60 * 24)
        resetPasswordUrl?: string // default: `/auth/reset-password`
        redirectTo?: string // default: `/auth/login`
        sendEmailResetPassword: (email: string, token: string) => Promise<void>
      }
    }
  }
}

export interface AuthApiBuilderArgs<
  TContext extends Contextable,
  TAuthOptions extends AuthOptions,
> {
  context: TContext
  handler: AuthInternalHandler
  options: TAuthOptions
}

export function auth<TContext extends Contextable, TAuthOptions extends AuthOptions>(
  context: TContext,
  options: TAuthOptions
) {
  const authHandler = createAuthInternalHandler(options)

  const apiOptions = {
    context,
    handler: authHandler,
    options,
  } satisfies AuthApiBuilderArgs<TContext, TAuthOptions>

  const api = {
    //  No authentication required
    signUpEmail: signUpEmail(apiOptions),
    loginEmail: loginEmail(apiOptions),
    signOut: signOut(apiOptions),
    forgotPasswordEmail: forgotPasswordEmail(apiOptions),
    resetPasswordEmail: resetPasswordEmail(apiOptions),
    validateResetToken: validateResetToken(apiOptions),
    sendEmailResetPassword: sendResetPasswordEmail(apiOptions),
    // Authentication required
    me: me(apiOptions),
  } as const

  return {
    api: api,
    uis: [],
  } satisfies GensekiCore
}
