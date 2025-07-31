import z from 'zod/v4'

import type { Contextable } from '../../core/context'
import { createEndpoint } from '../../core/endpoint'
import type { AuthApiBuilderArgs, AuthOptions } from '..'
import { getSessionCookie, ResponseHelper } from '../utils'

export function signOut<TContext extends Contextable, TAuthOptions extends AuthOptions>(
  builderArgs: AuthApiBuilderArgs<TContext, TAuthOptions>
) {
  return createEndpoint(
    builderArgs.context,
    {
      method: 'POST',
      path: '/auth/sign-out',
      responses: {
        200: z.object({
          status: z.string(),
        }),
      },
    },
    async (args, { request, response }) => {
      const cookie = getSessionCookie(request)

      if (!cookie) {
        ResponseHelper.deleteSessionCookie(response)
        // TODO: Handle error
        throw new Error('No session cookie found')
      }

      await builderArgs.handler.session.deleteByToken(cookie)
      ResponseHelper.deleteSessionCookie(response)

      return {
        status: 200,
        body: {
          status: 'ok',
        },
      }
    }
  )
}
