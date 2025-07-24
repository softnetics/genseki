import { defu } from 'defu'
import type { PartialDeep } from 'type-fest'
import { z, type ZodString } from 'zod/v4'

import { loginEmail } from './api/login'
import { requestResetPassword } from './api/request-reset-password'
import { resetPasswordEmail } from './api/reset-password-email'
import { signOut } from './api/sign-out'
import { signUpEmail } from './api/sign-up'
import { validateResetPasswordToken } from './api/validate-reset-password-token'
import { EmailAndPasswordService } from './service'
import { hashPassword } from './utilts'
import { ForgotPasswordView } from './views/forgot-password/forgot-password'
import { AuthLayout } from './views/layout'
import { LoginView } from './views/login'
import { ResetPasswordView } from './views/reset-password/reset-password'
import { SignUpView } from './views/sign-up'

import { createPlugin, type GensekiUiRouter } from '../../../core/config'
import type { AnyContextable } from '../../../core/context'
import { createEndpoint } from '../../../core/endpoint'
import type { Fields } from '../../../core/field'
import { GensekiUiCommonId } from '../../../core/ui'
import type {
  AnyAccountTable,
  AnySessionTable,
  AnyUserTable,
  AnyVerificationTable,
} from '../../base'

interface EmailAndPasswordPluginOptions<TFields extends Fields = Fields> {
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
  signUp?: {
    autoLogin?: boolean
    additionalFields?: TFields
  }
  changePassword?: {
    enabled?: boolean
    enabledPasswordNotSameAsCurrent?: boolean
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
  passwordHasher: hashPassword,
  login: {
    sessionExpiredInMs: 1000 * 60 * 60 * 24, // Default to 24 hours
  },
  signUp: {
    autoLogin: true,
  },
  changePassword: {
    enabled: true,
    enabledPasswordNotSameAsCurrent: true,
  },
  resetPassword: {
    enabled: false,
    resetPasswordUrl: '/auth/reset-password',
    expiredInMs: 1000 * 60 * 60 * 24,
  },
} satisfies PartialDeep<EmailAndPasswordPluginOptions>

export type EmailAndPasswordPluginOptionsWithDefaults<TFields extends Fields = Fields> = ReturnType<
  typeof defu<EmailAndPasswordPluginOptions<TFields>, [typeof defaultOptions]>
>

export function emailAndPasswordPlugin<
  TContext extends AnyContextable,
  TSignUpFields extends Fields,
  TOptions extends EmailAndPasswordPluginOptions<TSignUpFields>,
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
        signUpEmail: signUpEmail(service),
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
