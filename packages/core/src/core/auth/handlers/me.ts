import z from 'zod'

import { ApiRoute, ApiRouteHandler, ApiRouteSchema } from '~/core/endpoint'

import { AuthContext } from '../context'

interface InternalRouteOptions {
  prefix?: string
}

export function me<const TOptions extends InternalRouteOptions>(options: TOptions) {
  const schema = {
    method: 'GET',
    path: (options.prefix ? `${options.prefix}/me` : '/me') as TOptions['prefix'] extends string
      ? `${TOptions['prefix']}/me`
      : '/me',
    responses: {
      200: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        'image?': z.string().nullable(),
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

  return {
    ...schema,
    handler,
  } satisfies ApiRoute
}
