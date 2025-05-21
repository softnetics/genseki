import z from 'zod'

import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../endpoint'
import { AccountProvider } from '../constant'
import { type AuthContext } from '../context'
import { setSessionCookie } from '../utils'

interface InternalRouteOptions {
  prefix?: string
}

export function signInEmail<const TOptions extends InternalRouteOptions>(options: TOptions) {
  const schema = {
    method: 'POST',
    path: '/api/auth/sign-in-email',
    body: z.object({
      email: z.string(),
      password: z.string(),
    }),
    responses: {
      200: z.object({
        token: z.string().nullable(),
        user: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          image: z.string().nullable().optional(),
        }),
      }),
    },
  } as const satisfies ApiRouteSchema

  const handler: ApiRouteHandler<AuthContext, typeof schema> = async (args) => {
    const account = await args.context.internalHandlers.account.findByUserEmailAndProvider(
      args.body.email,
      AccountProvider.CREDENTIAL
    )

    // TODO: Hash password and compare
    const hashPassword = account.password
    if (account.password !== hashPassword) {
      throw new Error('Invalid password')
    }

    const session = await args.context.internalHandlers.session.create({
      userId: account.userId,
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

  return createEndpoint(schema, handler)
}
