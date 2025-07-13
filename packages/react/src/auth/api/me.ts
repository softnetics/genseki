import z from 'zod/v4'

import type { Contextable } from '../../core/context'
import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../core/endpoint'
import type { AuthApiBuilderArgs, AuthOptions } from '..'

export function me<TContext extends Contextable, TAuthOptions extends AuthOptions>(
  builderArgs: AuthApiBuilderArgs<TContext, TAuthOptions>
) {
  const schema = {
    method: 'GET',
    path: '/auth/me',
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
    const { id } = await args.context.requiredAuthenticated()
    const user = await builderArgs.handler.user.findById(id)

    return {
      status: 200,
      body: user,
    }
  }

  return createEndpoint(schema, handler)
}
