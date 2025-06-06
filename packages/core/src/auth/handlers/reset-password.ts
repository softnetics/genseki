import z from 'zod/v4'

import type { Context } from '../../context'
import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../endpoint'
import { type AuthContext } from '../context'

export function resetPasswordEmail<
  const TAuthContext extends AuthContext,
  const TContext extends Context,
>(authContext: TAuthContext) {
  const { authConfig, internalHandlers } = authContext
  const schema = {
    method: 'POST',
    path: '/api/auth/reset-password',
    query: z.object({
      token: z.string(),
    }),
    body: z.object({
      password: z.string(),
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

    const identifier = `reset-password:${args.query.token}`
    const verification = await internalHandlers.verification.findByIdentifier(identifier)

    if (!verification.value) {
      return {
        status: 400,
        body: { status: 'invalid reset password value' },
      }
    }

    const user = await internalHandlers.user.findById(verification.value)

    const hashedPassword = args.body.password // TODO: hash password
    await internalHandlers.account.updatePassword(user.id, hashedPassword)

    const redirectTo = `${authConfig.resetPassword?.redirectTo ?? '/auth/login'}`

    const responseHeaders = {
      Location: redirectTo,
    }

    return {
      status: 200,
      headers: responseHeaders,
      body: { status: 'ok' },
    }
  }

  return createEndpoint(schema, handler)
}
