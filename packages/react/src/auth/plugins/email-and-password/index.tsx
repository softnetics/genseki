import type { ReactNode } from 'react'

import { defu } from 'defu'
import type { PartialDeep } from 'type-fest'
import { z, type ZodString } from 'zod/v4'

import { loginEmail } from './api/login'
import { requestResetPassword } from './api/request-reset-password'
import { resetPasswordEmail } from './api/reset-password-email'
import { signOut } from './api/sign-out'
import { validateResetPasswordToken } from './api/validate-reset-password-token'
import { EmailAndPasswordService } from './service'
import { Password } from './utils'
import { ForgotPasswordView } from './views/forgot-password/forgot-password'
import { AuthLayout } from './views/layout'
import { LoginView } from './views/login'
import { ResetPasswordView } from './views/reset-password/reset-password'

import type { MaybePromise } from '../../../core/collection'
import { createPlugin, type GensekiUiRouter } from '../../../core/config'
import type { AnyContextable } from '../../../core/context'
import { createEndpoint } from '../../../core/endpoint'
import { GensekiUiCommonId } from '../../../core/ui'
import type {
  AnyAccountTable,
  AnySessionTable,
  AnyUserTable,
  AnyVerificationTable,
} from '../../base'

interface EmailAndPasswordPluginOptions {
  schema: {
    user: AnyUserTable
    session: AnySessionTable
    account: AnyAccountTable
    verification: AnyVerificationTable
  }
  passwordRequirements?: ZodString
  passwordHasher?: (password: string) => Promise<string>
  login?: {
    sessionExpiredInMs?: number
  }
  setUp: {
    enabled?: boolean | (() => MaybePromise<boolean>)
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
export function emailAndPasswordPlugin<
  TContext extends AnyContextable,
  TOptions extends EmailAndPasswordPluginOptions,
>(context: TContext, options: TOptions) {
  const optionsWithDefaults = defu(options, defaultOptions)

  const meApi = createEndpoint(
    context,
    {
      method: 'GET',
      path: '/auth/me',
      responses: {
        // TODO: Make it type-safe
        200: z.any(),
      },
    },
    async (payload) => {
      const user = await payload.context.requiredAuthenticated()
      return {
        status: 200,
        body: user,
      }
    }
  )

  return createPlugin({
    name: 'auth',
    plugin: (input) => {
      const service = new EmailAndPasswordService(context, optionsWithDefaults)

      const api = {
        //  No authentication required
        loginEmail: loginEmail(service),
        signOut: signOut(service),
        resetPasswordEmail: resetPasswordEmail(service),
        validateResetPasswordToken: validateResetPasswordToken(service),
        sendEmailResetPassword: requestResetPassword(service),
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
          render: (args) => {
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
        },
      ]

      if (optionsWithDefaults.setUp?.enabled ?? true) {
        const View = optionsWithDefaults.setUp.ui
        uis.push({
          context: context,
          path: '/auth/setup',
          requiredAuthenticated: false,
          render: (args) => (
            <AuthLayout>
              <View />
            </AuthLayout>
          ),
        })
      }

      return {
        api: {
          auth: {
            ...api,
            me: meApi,
          },
        },
        uis: uis,
      }
    },
  })
}

export { Password } from './utils'
