import z from 'zod/v4'

import type { AnyContext } from '../../core/context'
import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../core/endpoint'
import { type AuthContext } from '../context'
import { deleteSessionCookie, getSessionCookie } from '../utils'

export function signOut<const TAuthContext extends AuthContext, const TContext extends AnyContext>(
  authContext: TAuthContext
) {
  const { internalHandlers } = authContext

  const schema = {
    method: 'POST',
    path: '/api/auth/sign-out',
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
    await internalHandlers.session.deleteById(cookie)
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
