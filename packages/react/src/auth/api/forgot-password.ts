import z from 'zod/v4'

import type { Contextable } from '../../core/context'
import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../core/endpoint'
import type { AuthApiBuilderArgs, AuthOptions } from '..'

export function forgotPasswordEmail<TContext extends Contextable, TAuthOptions extends AuthOptions>(
  builderArgs: AuthApiBuilderArgs<TContext, TAuthOptions>
) {
  const schema = {
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
  } as const satisfies ApiRouteSchema

  const handler: ApiRouteHandler<TContext, typeof schema> = async (args) => {
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

    const resetPasswordLink = `${builderArgs.options.method.emailAndPassword?.resetPassword?.resetPasswordUrl ?? '/auth/reset-password'}?token=${verification.value}`
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
