import z from 'zod'

import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../endpoint'
import { type AuthContext } from '../context'

interface InternalRouteOptions {
  prefix?: string
}

export function sendEmailResetPassword<const TOptions extends InternalRouteOptions>(
  options: TOptions
) {
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

  const handler: ApiRouteHandler<AuthContext, typeof schema> = async (args) => {
    if (!args.context.authConfig.resetPassword?.enabled) {
      // TODO: Log not enabled
      return {
        status: 400,
        body: { status: 'reset password not enabled' },
      }
    }
    let user
    try {
      user = await args.context.internalHandlers.user.findByEmail(args.body.email)
    } catch {
      return {
        status: 400,
        body: { status: 'user not found' },
      }
    }

    // Generate a secure random token
    const token = crypto.randomUUID()
    const identifier = `reset-password:${token}`
    await args.context.internalHandlers.verification.deleteByUserIdAndIdentifierPrefix(
      user.id,
      'reset-password:'
    )

    await args.context.internalHandlers.verification.create({
      identifier,
      value: user.id,
      expiresAt: new Date(
        Date.now() + (args.context.authConfig.resetPassword?.expiresInMs ?? 1000 * 60 * 60 * 24) // TODO; make config always set default
      ),
    })

    // TODO: change this to domain config websiteURL
    const resetPasswordLink = `${args.context.authConfig.resetPassword?.resetPasswordUrl ?? 'http://localhost:3000/admin/auth/reset-password'}?token=${token}`
    // Send email
    if (args.context.authConfig.resetPassword?.sendEmailResetPassword) {
      await args.context.authConfig.resetPassword.sendEmailResetPassword(
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

  return createEndpoint(schema, handler)
}
