import z from 'zod/v4'

import type { Context } from '../../context'
import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../endpoint'
import { type AuthContext } from '../context'

export function me<const TAuthContext extends AuthContext, const TContext extends Context>(
  authContext: TAuthContext
) {
  const { requiredAuthenticated } = authContext

  const schema = {
    method: 'GET',
    path: '/api/auth/me',
    responses: {
      200: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        image: z.string().nullable().optional(),
      }),
      401: z.object({
        status: z.string(),
      }),
    },
  } as const satisfies ApiRouteSchema

  const handler: ApiRouteHandler<TContext, typeof schema> = async (args) => {
    const user = await requiredAuthenticated(args.headers)

    return {
      status: 200,
      body: user,
    }
  }

  return createEndpoint(schema, handler)
}
