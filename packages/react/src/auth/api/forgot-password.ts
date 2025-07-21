import z from 'zod/v4'

import type { Contextable } from '../../core/context'
import { createEndpoint } from '../../core/endpoint'
import type { AuthApiBuilderArgs, AuthOptions } from '..'

export function forgotPasswordEmail<TContext extends Contextable, TAuthOptions extends AuthOptions>(
  builderArgs: AuthApiBuilderArgs<TContext, TAuthOptions>
) {
  return createEndpoint(
    builderArgs.context,
    {
      method: 'POST',
      path: '/auth/forgot-password',
      body: z.object({
        email: z.string(),
      }),
      responses: {
        200: z.object({
          status: z.string(),
        }),
        400: z.object({
          status: z.string(),
        }),
      },
    },
    async (args) => {
      if (!builderArgs.options.method.emailAndPassword?.resetPassword?.enabled) {
        // TODO: Log not enabled
        return {
          status: 400,
          body: { status: 'reset password not enabled' },
        }
      }

      const user = await builderArgs.handler.user.findByEmail(args.body.email)

      const verification = await builderArgs.handler.verification.createWithResetPasswordToken(
        user.id,
        builderArgs.options.method.emailAndPassword?.resetPassword?.expiresInMs
      )

      // TODO: Send forgot password link to email or SMS
      const resetPasswordLink = `${builderArgs.options.method.emailAndPassword?.resetPassword?.resetPasswordUrl ?? '/auth/reset-password'}?token=${verification.value}`

      return {
        status: 200,
        body: {
          status: 'ok',
        },
      }
    }
  )
}
