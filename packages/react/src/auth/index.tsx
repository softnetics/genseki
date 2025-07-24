import { forgotPasswordEmail } from './api/forgot-password'
import { loginEmail } from './api/login-email'
import { me } from './api/me'
import {
  resetPasswordEmail,
  validateResetToken,
  validateVerification,
} from './api/reset-password-email'
import { sendResetPasswordEmail } from './api/send-email-reset-password'
import { signOut } from './api/sign-out'
import { signUpEmail } from './api/sign-up-email'
import { type AuthInternalHandler, createAuthInternalHandler } from './context'
import { ForgotPasswordView } from './views/forgot-password/forgot-password'
import { AuthLayout } from './views/layout'
import { LoginView } from './views/login'
import { ResetPasswordView } from './views/reset-password/reset-password'
import { SignUpView } from './views/sign-up'

import { createPlugin, type GensekiUiRouter } from '../core/config'
import { type AnyContextable } from '../core/context'
import type { Fields } from '../core/field'
import type { DataType } from '../core/model'
import type {
  AnyTable,
  AnyTypedFieldColumn,
  WithHasDefaultValue,
  WithIsRequired,
} from '../core/table'
import { GensekiUiCommonId } from '../core/ui'

export * from './constant'
export * from './utils'

export type AnyUserTable = AnyTable<{
  columns: {
    id: WithHasDefaultValue<WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>>
    name: AnyTypedFieldColumn<typeof DataType.STRING>
    email: AnyTypedFieldColumn<typeof DataType.STRING>
    emailVerified: AnyTypedFieldColumn<typeof DataType.BOOLEAN>
    image: AnyTypedFieldColumn<typeof DataType.STRING>
  }
  relations: {}
  uniqueFields: (['id'] | ['email'])[]
}>

export type AnySessionTable = AnyTable<{
  columns: {
    id: WithHasDefaultValue<WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>>
    expiredAt: WithIsRequired<AnyTypedFieldColumn<typeof DataType.DATETIME>>
    token: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
    ipAddress: AnyTypedFieldColumn<typeof DataType.STRING>
    userAgent: AnyTypedFieldColumn<typeof DataType.STRING>
    userId: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
  }
  relations: {}
}>

export type AnyAccountTable = AnyTable<{
  columns: {
    id: WithHasDefaultValue<WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>>
    // Account ID is a unique identifier for the account (e.g., Google ID, Facebook ID, User ID)
    accountId: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
    // Provider ID is the identifier for the provider (e.g., google, facebook, credentials)
    provider: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
    // User ID is the identifier for the user in the system
    userId: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
    idToken: AnyTypedFieldColumn<typeof DataType.STRING>
    accessToken: AnyTypedFieldColumn<typeof DataType.STRING>
    refreshToken: AnyTypedFieldColumn<typeof DataType.STRING>
    accessTokenExpiredAt: AnyTypedFieldColumn<typeof DataType.DATETIME>
    refreshTokenExpiredAt: AnyTypedFieldColumn<typeof DataType.DATETIME>
    scope: AnyTypedFieldColumn<typeof DataType.STRING>
    // Password is used for email and password authentication
    password: AnyTypedFieldColumn<typeof DataType.STRING>
  }
  relations: {}
  uniqueFields: (['id'] | ['userId', 'provider'])[]
}>

export type AnyVerificationTable = AnyTable<{
  columns: {
    id: WithHasDefaultValue<WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>>
    identifier: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
    value: AnyTypedFieldColumn<typeof DataType.STRING>
    expiredAt: WithIsRequired<AnyTypedFieldColumn<typeof DataType.DATETIME>>
    createdAt: WithHasDefaultValue<WithIsRequired<AnyTypedFieldColumn<typeof DataType.DATETIME>>>
  }
  relations: {}
}>

export interface AuthOptions {
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
      changePassword?: {
        enabled?: boolean // default: true
        enabledPasswordNotSameAsCurrent?: boolean // default: true
      }
      resetPassword?: {
        enabled?: boolean // default: false
        expiredInMs?: number // default: 1 day (1000 * 60 * 60 * 24)
        resetPasswordUrl?: string // default: `/auth/reset-password`
        sendEmailResetPassword: (email: string, token: string) => Promise<void>
      }
    }
  }
}

export interface AuthApiBuilderArgs<
  TContext extends AnyContextable,
  TAuthOptions extends AuthOptions,
> {
  context: TContext
  handler: AuthInternalHandler
  options: TAuthOptions
}

export function auth<TContext extends AnyContextable, TAuthOptions extends AuthOptions>(
  context: TContext,
  options: TAuthOptions
) {
  return createPlugin({
    name: 'auth',
    plugin: (input) => {
      const authHandler = createAuthInternalHandler(context, options)

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

      const uis: GensekiUiRouter[] = [
        {
          id: GensekiUiCommonId.AUTH_LOGIN,
          context: context,
          path: '/auth/login',
          requiredAuthenticated: false,
          render: (args) => (
            <AuthLayout>
              <LoginView {...args} {...args.params} />
            </AuthLayout>
          ),
        },
        {
          id: GensekiUiCommonId.AUTH_SIGNUP,
          context: context,
          path: '/auth/sign-up',
          requiredAuthenticated: false,
          render: (args) => (
            <AuthLayout>
              <SignUpView {...args} {...args.params} />
            </AuthLayout>
          ),
        },
        {
          id: GensekiUiCommonId.AUTH_FORGOT_PASSWORD,
          context: context,
          path: '/auth/forgot-password',
          requiredAuthenticated: false,
          render: (args) => (
            <AuthLayout>
              <ForgotPasswordView {...args} {...args.params} />
            </AuthLayout>
          ),
        },
        {
          id: GensekiUiCommonId.AUTH_RESET_PASSWORD,
          context: context,
          path: '/auth/reset-password',
          requiredAuthenticated: false,
          render: (args) => (
            <AuthLayout>
              <ResetPasswordView
                {...args}
                validateToken={async (token) => {
                  const verification = await authHandler.verification.create({
                    identifier: authHandler.identifier.resetPassword(token),
                    value: token,
                    expiredAt: new Date(
                      Date.now() +
                        (options.method.emailAndPassword?.resetPassword?.expiredInMs ??
                          1000 * 60 * 60 * 24)
                    ),
                  })
                  const validation = await validateVerification(verification)
                  return !!validation
                }}
              />
            </AuthLayout>
          ),
        },
      ]

      return {
        api: { auth: api },
        uis: uis,
      }
    },
  })
}
