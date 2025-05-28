import z from 'zod'

import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../endpoint'
import { type AuthContext } from '../context'

interface InternalRouteOptions {
  prefix?: string
}

export function me<const TOptions extends InternalRouteOptions>(options: TOptions) {
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

  const handler: ApiRouteHandler<AuthContext, typeof schema> = async (args) => {
    const user = await args.requestContext.requiredAuthenticated()

    return {
      status: 200,
      body: user,
    }
  }

  return createEndpoint(schema, handler)
}
