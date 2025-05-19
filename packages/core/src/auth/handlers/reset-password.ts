import z from 'zod'

import { ApiRouteHandler, ApiRouteSchema, createEndpoint } from '../../endpoint'
import { AuthContext } from '../context'
import { WithPrefix } from '../types'

interface InternalRouteOptions {
  prefix?: string
}

export function resetPasswordEmail<const TOptions extends InternalRouteOptions>(options: TOptions) {
  const schema = {
    method: 'POST',
    path: (options.prefix
      ? `${options.prefix}/auth/reset-password`
      : '/auth/reset-password') as WithPrefix<TOptions['prefix'], '/auth/reset-password'>,
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
  } satisfies ApiRouteSchema

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

    if (!verification.value) {
      return {
        status: 400,
        body: { status: 'invalid reset password value' },
      }
    }

    const user = await args.context.internalHandlers.user.findById(verification.value)

    const hashedPassword = args.body.password // TODO: hash password
    await args.context.internalHandlers.account.updatePassword(user.id, hashedPassword)

    const redirectTo = `${args.context.authConfig.resetPassword?.redirectTo ?? '/auth/login'}`

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
