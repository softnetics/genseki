import z from 'zod'

import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../endpoint'
import { type AuthContext } from '../context'
import { deleteSessionCookie, getSessionCookie } from '../utils'

interface InternalRouteOptions {
  prefix?: string
}

export function signOut<const TOptions extends InternalRouteOptions>(options: TOptions) {
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

  const handler: ApiRouteHandler<AuthContext, typeof schema> = async (args) => {
    const cookie = getSessionCookie(args.headers)

    if (!cookie) {
      deleteSessionCookie(args.headers)
      // TODO: Handle error
      throw new Error('No session cookie found')
    }

    const internalHandlers = args.context.get('internalHandlers')
    await internalHandlers.session.deleteById(cookie)
    deleteSessionCookie(args.headers)

    return {
      status: 200,
      headers: args.headers,
      body: {
        status: 'ok',
      },
    }
  }

  return createEndpoint(schema, handler)
}
