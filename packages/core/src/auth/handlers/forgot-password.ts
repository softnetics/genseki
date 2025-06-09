import z from 'zod/v4'

import type { Context } from '../../context'
import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../endpoint'
import type { AuthContext } from '../context'

export function forgotPasswordEmail<
  const TAuthContext extends AuthContext,
  const TContext extends Context,
>(authContext: TAuthContext) {
  const { authConfig, internalHandlers } = authContext

  const schema = {
    method: 'POST',
    path: '/api/auth/forgot-password',
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
    if (!authConfig.resetPassword?.enabled) {
      // TODO: Log not enabled
      return {
        status: 400,
        body: { status: 'reset password not enabled' },
      }
    }

    const user = await internalHandlers.user.findByEmail(args.body.email)

    const token = ''
    const identifier = `reset-password:${token}`
    await internalHandlers.verification.create({
      identifier,
      value: user.id,
      expiresAt: new Date(
        Date.now() + (authConfig.resetPassword?.expiresInMs ?? 1000 * 60 * 60 * 24)
      ),
    })

    const resetPasswordLink = `${authConfig.resetPassword?.resetPasswordUrl ?? '/auth/reset-password'}?token=${token}`
    // Send email

    return {
      status: 200,
      body: {
        status: 'ok',
      },
    }
  }

  return createEndpoint(schema, handler)
}
