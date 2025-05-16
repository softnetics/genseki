import z from 'zod'

import { ApiRoute, ApiRouteHandler, ApiRouteSchema } from '~/core/endpoint'

import { AuthContext } from '../context'
import { deleteSessionCookie, getSessionCookie } from '../utils'

interface InternalRouteOptions {
  prefix?: string
}

export function signOut(options: InternalRouteOptions) {
  const schema = {
    method: 'POST',
    path: options.prefix ? `${options.prefix}/sign-out` : '/sign-out',
    body: undefined,
    responses: {
      200: z.interface({
        status: z.string(),
      }),
    },
  } satisfies ApiRouteSchema

  const handler: ApiRouteHandler<AuthContext, typeof schema> = async (args) => {
    const cookie = getSessionCookie(args.headers)

    if (!cookie) {
      deleteSessionCookie(args.headers)
      // TODO: Handle error
      throw new Error('No session cookie found')
    }

    await args.context.internalHandlers.session.deleteById(cookie)
    deleteSessionCookie(args.headers)

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
