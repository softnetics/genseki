import z from 'zod'

import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../endpoint'
import { type AuthContext } from '../context'
import { hashPassword } from '../utils'

interface InternalRouteOptions {
  prefix?: string
}

export function resetPasswordEmail<const TOptions extends InternalRouteOptions>(options: TOptions) {
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

  const handler: ApiRouteHandler<AuthContext, typeof schema> = async (args) => {
    if (!args.context.authConfig.resetPassword?.enabled) {
      // TODO: Log not enabled
      return {
        status: 400,
        body: { status: 'reset password not enabled' },
      }
    }

    const identifier = `reset-password:${args.query.token}`
    const verification =
      await args.context.internalHandlers.verification.findByIdentifier(identifier)

    if (!verification || !verification.value) {
      return {
        status: 400,
        body: { status: 'invalid reset password value' },
      }
    }

    const user = await args.context.internalHandlers.user.findById(verification.value)

    if (!user) {
      return {
        status: 400,
        body: { status: 'user not found' },
      }
    }

    if (verification.expiresAt < new Date()) {
      return {
        status: 400,
        body: { status: 'reset password token expired' },
      }
    }

    // delete the verification token
    await args.context.internalHandlers.verification.delete(verification.id)

    const hashedPassword = await hashPassword(args.body.password)
    await args.context.internalHandlers.account.updatePassword(user.id, hashedPassword)

    const redirectTo = `${args.context.authConfig.resetPassword?.redirectTo ?? '/admin/auth/login'}`

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
