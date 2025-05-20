import z from 'zod'

import { ApiRouteHandler, ApiRouteSchema, createEndpoint } from '../../endpoint'
import { AuthContext } from '../context'

interface InternalRouteOptions {
  prefix?: string
}

export function forgotPasswordEmail<const TOptions extends InternalRouteOptions>(
  options: TOptions
) {
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
  } satisfies ApiRouteSchema

  const handler: ApiRouteHandler<AuthContext, typeof schema> = async (args) => {
    if (!args.context.authConfig.resetPassword?.enabled) {
      // TODO: Log not enabled
      return {
        status: 400,
        body: { status: 'reset password not enabled' },
      }
    }

    const user = await args.context.internalHandlers.user.findByEmail(args.body.email)

    const token = ''
    const identifier = `reset-password:${token}`
    await args.context.internalHandlers.verification.create({
      identifier,
      value: user.id,
      expiresAt: new Date(
        Date.now() + (args.context.authConfig.resetPassword?.expiresInMs ?? 1000 * 60 * 60 * 24)
      ),
    })

    const resetPasswordLink = `${args.context.authConfig.resetPassword?.resetPasswordUrl ?? '/auth/reset-password'}?token=${token}`
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
