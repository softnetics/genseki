import type { ReactNode } from 'react'

import { defu } from 'defu'
import type { PartialDeep } from 'type-fest'
import { type ZodString } from 'zod'

import { loginEmail } from './api/login'
import { requestResetPassword } from './api/request-reset-password'
import { resetPasswordEmail } from './api/reset-password-email'
import { signOut } from './api/sign-out'
import { validateResetPasswordToken } from './api/validate-reset-password-token'
import { EmailAndPasswordService } from './service'
import { Password } from './utils'
import { ForgotPasswordView } from './views/forgot-password/forgot-password'
import { AuthLayout } from './views/layout'
import { LoginView } from './views/login/login'
import { ResetPasswordView } from './views/reset-password/reset-password'

import { createGensekiUiRoute, type GensekiMiddleware } from '../../../core/config'
import type { AnyContextable } from '../../../core/context'
import { createPlugin } from '../../../core/plugin'
import type { IsValidTable } from '../../../core/table'
import { GensekiUiCommonId } from '../../../core/ui'
import type {
  AnyAccountTable,
  AnySessionTable,
  AnyUserTable,
  AnyVerificationTable,
} from '../../base'

export type AnyPluginSchema = {
  user: any
  session: any
  account: any
  verification: any
}

export type PluginSchema = {
  user: AnyUserTable
  session: AnySessionTable
  account: AnyAccountTable
  verification: AnyVerificationTable
}

type ValidateSchema<TSchema extends AnyPluginSchema, TContext extends AnyContextable> = {
  user: IsValidTable<PluginSchema['user'], TSchema['user']>
  session: IsValidTable<PluginSchema['session'], TSchema['session']>
  account: IsValidTable<PluginSchema['account'], TSchema['account']>
  verification: IsValidTable<PluginSchema['verification'], TSchema['verification']>
} extends {
  user: true
  session: true
  account: true
  verification: true
}
  ? EmailAndPasswordPluginOptions
  : {
      user: IsValidTable<PluginSchema['user'], TSchema['user']>
      session: IsValidTable<PluginSchema['session'], TSchema['session']>
      account: IsValidTable<PluginSchema['account'], TSchema['account']>
      verification: IsValidTable<PluginSchema['verification'], TSchema['verification']>
    }

interface EmailAndPasswordPluginOptions {
  passwordRequirements?: ZodString
  passwordHasher?: (password: string) => Promise<string>
  login?: {
    sessionExpiredInMs?: number
  }
  setup: {
    enabled?: boolean
    autoLogin?: boolean
    ui: () => ReactNode
  }
  changePassword?: {
    enabled?: boolean
    enableSamePassword?: boolean
  }
  resetPassword?: {
    enabled?: boolean
    expiredInMs?: number
    resetPasswordUrl?: string
    successRedirectUrl?: string
    sendEmailResetPassword?: (payload: {
      email: string
      token: string
      expiredAt: Date
      redirectUrl: string
    }) => Promise<void>
  }
}

const defaultOptions = {
  passwordHasher: Password.hashPassword,
  login: {
    sessionExpiredInMs: 1000 * 60 * 60 * 24, // Default to 24 hours
  },
  setup: {
    enabled: true,
  },
  changePassword: {
    enabled: true,
    enableSamePassword: true,
  },
  resetPassword: {
    enabled: false,
    resetPasswordUrl: '/auth/reset-password',
    expiredInMs: 1000 * 60 * 60 * 24,
  },
} satisfies PartialDeep<EmailAndPasswordPluginOptions>

export type EmailAndPasswordPluginOptionsWithDefaults = ReturnType<
  typeof defu<EmailAndPasswordPluginOptions, [typeof defaultOptions]>
>

function isOptions(options: any): options is EmailAndPasswordPluginOptions {
  return !(
    'user' in options &&
    'session' in options &&
    'account' in options &&
    'verification' in options
  )
}

export function emailAndPasswordPlugin<
  TContext extends AnyContextable,
  TSchema extends AnyPluginSchema,
  TOptions extends ValidateSchema<TSchema, TContext>,
>(context: TContext, schema: TSchema, _options: TOptions) {
  if (!isOptions(_options)) {
    throw new Error('Invalid options provided to emailAndPasswordPlugin')
  }

  const options = defu(_options, defaultOptions)

  const service = new EmailAndPasswordService(context, schema, options)

  const setupMiddleware: GensekiMiddleware = async (args) => {
    if (!options.setup.enabled) return
    const count = await service.userCounts()
    if (count > 0) return
    if (args.pathname.includes('/auth/setup')) return
    return { redirect: `/admin/auth/setup` }
  }

  return createPlugin('emailAndPassword', (app) => {
    if (_options.setup.enabled) {
      app.addMiddleware(setupMiddleware)
    }

    const api = {
      //  No authentication required
      loginEmail: loginEmail(service),
      signOut: signOut(service),
      resetPasswordEmail: resetPasswordEmail(service),
      validateResetPasswordToken: validateResetPasswordToken(service),
      sendEmailResetPassword: requestResetPassword(service),
    } as const

    const uis = [
      createGensekiUiRoute({
        id: GensekiUiCommonId.AUTH_LOGIN,
        context: context,
        path: '/auth/login',
        requiredAuthenticated: false,
        render: (args) => {
          return (
            <AuthLayout>
              <LoginView {...args} {...args.params} />
            </AuthLayout>
          )
        },
      }),
      createGensekiUiRoute({
        id: GensekiUiCommonId.AUTH_FORGOT_PASSWORD,
        context: context,
        path: '/auth/forgot-password',
        requiredAuthenticated: false,
        render: (args) => {
          if (!options.resetPassword.enabled) {
            throw new Error('Reset password is not enabled')
          }

          return (
            <AuthLayout>
              <ForgotPasswordView {...args} {...args.params} />
            </AuthLayout>
          )
        },
      }),
      createGensekiUiRoute({
        id: GensekiUiCommonId.AUTH_RESET_PASSWORD,
        context: context,
        path: '/auth/reset-password',
        requiredAuthenticated: false,
        render: (args) => {
          if (!options.resetPassword.enabled) {
            throw new Error('Reset password is not enabled')
          }

          return (
            <AuthLayout>
              <ResetPasswordView
                {...args}
                validateToken={async (token) => {
                  try {
                    const verification = await service.validateResetPasswordToken(token)
                    return !!verification
                  } catch (error) {
                    console.error('Error validating reset password token:', error)
                    return false
                  }
                }}
              />
            </AuthLayout>
          )
        },
      }),
    ]

    if (options.setup?.enabled ?? true) {
      const View = options.setup.ui
      uis.push(
        createGensekiUiRoute({
          context: context,
          path: '/auth/setup',
          requiredAuthenticated: false,
          render: async () => {
            if (!options.setup?.enabled) {
              throw new Error('Set up is not enabled')
            }

            const count = await service.userCounts()
            if (count > 0) {
              return { redirect: '/admin/auth/login', type: 'replace' }
            }

            return (
              <AuthLayout>
                <View />
              </AuthLayout>
            )
          },
        })
      )
    }

    return app.addApiRouter(api).addPages(uis)
  })
}

export * from './utils'
