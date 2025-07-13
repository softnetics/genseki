import z from 'zod/v4'

import type { Contextable } from '../../core/context'
import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../core/endpoint'
import type { AuthApiBuilderArgs, AuthOptions } from '..'
import { deleteSessionCookie, getSessionCookie } from '../utils'

export function signOut<TContext extends Contextable, TAuthOptions extends AuthOptions>(
  builderArgs: AuthApiBuilderArgs<TContext, TAuthOptions>
) {
  const schema = {
    method: 'POST',
    path: '/auth/sign-out',
    body: undefined,
    responses: {
      200: z.object({
        status: z.string(),
      }),
    },
  } as const satisfies ApiRouteSchema

  const handler: ApiRouteHandler<TContext, typeof schema> = async (args) => {
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

  return createEndpoint(schema, handler)
}
