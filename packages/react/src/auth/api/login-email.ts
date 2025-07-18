import z from 'zod/v4'

import type { Contextable } from '../../core/context'
import { createEndpoint } from '../../core/endpoint'
import type { AuthApiBuilderArgs, AuthOptions } from '..'
import { AccountProvider } from '../constant'
import { setSessionCookie, verifyPassword } from '../utils'

export function loginEmail<TContext extends Contextable, TAuthOptions extends AuthOptions>(
  builderArgs: AuthApiBuilderArgs<TContext, TAuthOptions>
) {
  return createEndpoint(
    builderArgs.context,
    {
      method: 'POST',
      path: '/auth/login/email',
      body: z.object({
        email: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.object({
          token: z.string().nullable(),
          user: z.object({
            id: z.string(),
            name: z.string().nullable().optional(),
            email: z.string().nullable().optional(),
            image: z.string().nullable().optional(),
          }),
        }),
      },
    },
    async (args) => {
      const account = await builderArgs.handler.account.findByUserEmailAndProvider(
        args.body.email,
        AccountProvider.CREDENTIAL
      )

      const verifyStatus = await verifyPassword(args.body.password, account.password as string)
      if (!verifyStatus) {
        throw new Error('Invalid password')
      }

      const session = await builderArgs.handler.session.create({
        userId: account.user.id,
        // TODO: Customize expiresAt
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })

      const responseHeaders = {}
      setSessionCookie(responseHeaders, session.token)

      return {
        status: 200,
        headers: responseHeaders,
        body: {
          token: session.token,
          user: account.user,
        },
      }
    }
  )
}
