import z from 'zod/v4'

import type { Contextable } from '../../core/context'
import { createEndpoint } from '../../core/endpoint'
import type { AuthApiBuilderArgs, AuthOptions } from '..'

export function me<TContext extends Contextable, TAuthOptions extends AuthOptions>(
  builderArgs: AuthApiBuilderArgs<TContext, TAuthOptions>
) {
  return createEndpoint(
    builderArgs.context,
    {
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
    },
    async (args) => {
      const { id } = await args.context.requiredAuthenticated()
      const user = await builderArgs.handler.user.findById(id)

      return {
        status: 200,
        body: user,
      }
    }
  )
}
