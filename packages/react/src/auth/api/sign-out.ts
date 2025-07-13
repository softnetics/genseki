import z from 'zod/v4'

import type { Contextable } from '../../core/context'
import { createEndpoint } from '../../core/endpoint'
import type { AuthApiBuilderArgs, AuthOptions } from '..'
import { deleteSessionCookie, getSessionCookie } from '../utils'

export function signOut<TContext extends Contextable, TAuthOptions extends AuthOptions>(
  builderArgs: AuthApiBuilderArgs<TContext, TAuthOptions>
) {
  return createEndpoint(
    builderArgs.context,
    {
      method: 'POST',
      path: '/auth/sign-out',
      body: undefined,
      responses: {
        200: z.object({
          status: z.string(),
        }),
      },
    },
    async (args) => {
      const cookie = getSessionCookie(args.headers)

      if (!cookie) {
        deleteSessionCookie(args.headers)
        // TODO: Handle error
        throw new Error('No session cookie found')
      }

      const responseHeaders = {}
      await builderArgs.handler.session.deleteById(cookie)
      deleteSessionCookie(responseHeaders)

      return {
        status: 200,
        body: {
          status: 'ok',
        },
        headers: responseHeaders,
      }
    }
  )
}
