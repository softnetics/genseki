import z from 'zod'

import { ApiRouteHandler, ApiRouteSchema, createEndpoint } from '../../endpoint'
import { AuthContext } from '../context'
import { WithPrefix } from '../types'

interface InternalRouteOptions {
  prefix?: string
}

export function me<const TOptions extends InternalRouteOptions>(options: TOptions) {
  const schema = {
    method: 'GET',
    path: (options.prefix ? `${options.prefix}/auth/me` : '/auth/me') as WithPrefix<
      TOptions['prefix'],
      '/auth/me'
    >,
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
  } satisfies ApiRouteSchema

  const handler: ApiRouteHandler<AuthContext, typeof schema> = async (args) => {
    const user = await args.context.requiredAuthenticated(args.headers)

    return {
      status: 200,
      body: user,
    }
  }

  return createEndpoint(schema, handler)
}
