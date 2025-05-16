import z from 'zod'

import { ApiRoute, ApiRouteHandler, ApiRouteSchema } from '~/core/endpoint'

import { AuthContext } from '../context'
import { WithPrefix } from '../types'

interface InternalRouteOptions {
  prefix?: string
}

export function forgotPasswordEmail<const TOptions extends InternalRouteOptions>(
  options: TOptions
) {
  const schema = {
    method: 'POST',
    path: (options.prefix ? `${options.prefix}/forgot-password` : '/forgot-password') as WithPrefix<
      TOptions['prefix'],
      '/forgot-password'
    >,
    body: z.interface({
      email: z.string(),
    }),
    responses: {
      200: z.interface({
        status: z.string(),
      }),
      400: z.interface({
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

  return {
    ...schema,
    handler,
  } satisfies ApiRoute
}
