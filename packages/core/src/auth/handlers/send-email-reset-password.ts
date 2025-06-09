import z from 'zod/v4'

import type { Context } from '../../context'
import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../endpoint'
import { type AuthContext } from '../context'

export function sendEmailResetPassword<
  const TAuthContext extends AuthContext,
  const TContext extends Context,
>(authContext: TAuthContext) {
  const { authConfig, internalHandlers } = authContext

  const schema = {
    method: 'POST',
    path: '/api/auth/send-otp-forgot-password',
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
  } as const satisfies ApiRouteSchema

  const handler: ApiRouteHandler<TContext, typeof schema> = async (args) => {
    console.log('sendEmailResetPassword called with args:', args)
    if (!authConfig.resetPassword?.enabled) {
      // TODO: Log not enabled
      return {
        status: 400,
        body: { status: 'reset password not enabled' },
      }
    }
    let user
    try {
      console.log('Finding user by email:', args.body.email)
      user = await internalHandlers.user.findByEmail(args.body.email)
    } catch {
      return {
        status: 400,
        body: { status: 'user not found' },
      }
    }

    // Generate a secure random token
    const token = crypto.randomUUID()
    const identifier = `reset-password:${token}`
    await internalHandlers.verification.deleteByUserIdAndIdentifierPrefix(
      user.id,
      'reset-password:'
    )

    await internalHandlers.verification.create({
      identifier,
      value: user.id,
      expiresAt: new Date(
        Date.now() + (authConfig.resetPassword?.expiresInMs ?? 1000 * 60 * 60 * 24) // TODO; make config always set default
      ),
    })

    // TODO: change this to domain config websiteURL
    const resetPasswordLink = `${authConfig.resetPassword?.resetPasswordUrl ?? 'http://localhost:3000/admin/auth/reset-password'}?token=${token}`
    // Send email
    if (authConfig.resetPassword?.sendEmailResetPassword) {
      await authConfig.resetPassword.sendEmailResetPassword(user.email, resetPasswordLink)
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

  return createEndpoint(schema, handler)
}
