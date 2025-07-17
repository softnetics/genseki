import z from 'zod/v4'

import type { Contextable } from '../../core/context'
import { createEndpoint } from '../../core/endpoint'
import type { AuthApiBuilderArgs, AuthOptions } from '..'

export function sendResetPasswordEmail<
  TContext extends Contextable,
  TAuthOptions extends AuthOptions,
>(builderArgs: AuthApiBuilderArgs<TContext, TAuthOptions>) {
  return createEndpoint(
    builderArgs.context,
    {
      method: 'POST',
      path: '/auth/send-otp-forgot-password',
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
        500: z.object({
          status: z.string(),
        }),
      },
    },
    async (args) => {
      console.log('sendEmailResetPassword called with args:', args)
      if (!builderArgs.options.method.emailAndPassword?.resetPassword?.enabled) {
        // TODO: Log not enabled
        return {
          status: 400,
          body: { status: 'reset password not enabled' },
        }
      }
      let user
      try {
        console.log('Finding user by email:', args.body.email)
        user = await builderArgs.handler.user.findByEmail(args.body.email)
      } catch {
        return {
          status: 400,
          body: { status: 'user not found' },
        }
      }

      if (!user.email) {
        return {
          status: 500,
          body: { status: 'user email not found' },
        }
      }

      // Generate a secure random token
      const token = crypto.randomUUID()
      const identifier = `reset-password:${token}`
      await builderArgs.handler.verification.deleteByUserIdAndIdentifierPrefix(
        user.id,
        'reset-password:'
      )

      await builderArgs.handler.verification.create({
        identifier,
        value: user.id,
        expiresAt: new Date(
          Date.now() +
            (builderArgs.options.method.emailAndPassword?.resetPassword?.expiresInMs ??
              1000 * 60 * 60 * 24) // TODO; make config always set default
        ),
      })

      // TODO: change this to domain config websiteURL
      const resetPasswordLink = `${builderArgs.options.method.emailAndPassword?.resetPassword?.resetPasswordUrl ?? 'http://localhost:3000/admin/auth/reset-password'}?token=${token}`

      // Send email
      if (builderArgs.options.method.emailAndPassword?.resetPassword?.sendEmailResetPassword) {
        await builderArgs.options.method.emailAndPassword?.resetPassword.sendEmailResetPassword(
          user.email,
          resetPasswordLink
        )
      } else {
        // Fallback to console log for development
        console.warn(
          'No "auth.resetPassword.sendEmailResetPassword" function provided, using console.log for development purposes.'
        )
      }

      return {
        status: 200,
        body: {
          status: 'ok',
        },
      }
    }
  )
}
