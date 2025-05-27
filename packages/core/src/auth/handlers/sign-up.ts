import z from 'zod'

import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../endpoint'
import type { AuthConfig } from '..'
import { AccountProvider } from '../constant'
import { type AuthContext } from '../context'
import { hashPassword, setSessionCookie } from '../utils'

export function signUp<const TOptions extends AuthConfig>(options: TOptions) {
  const schema = {
    method: 'POST',
    path: '/api/auth/sign-up',
    body: z
      .object({
        name: z.string(),
        email: z.string(),
        password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
      })
      .and(z.record(z.string(), z.any())),
    responses: {
      200: z.object({
        token: z.string().nullable(),
        user: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          image: z.string().nullable(),
        }),
      }),
    },
  } as const satisfies ApiRouteSchema

  const handler: ApiRouteHandler<AuthContext, typeof schema> = async (args) => {
    const hasedPassword =
      (await options.emailAndPassword?.passwordHasher?.(args.body.password)) ??
      (await hashPassword(args.body.password))

    const user = await args.context.internalHandlers.user.create({
      name: args.body.name,
      email: args.body.email,
      image: null,
    })

    await args.context.internalHandlers.account.link({
      userId: user.id,
      providerId: AccountProvider.CREDENTIAL,
      accountId: user.id,
      password: hasedPassword,
    })

    // TODO: Check if sending email verification is enabled
    // NOTE: Callback URL is used for email verification

    // Check if auto login is enabled
    const session = await args.context.internalHandlers.session.create({
      userId: user.id,
      // TODO: Customize expiresAt
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })

    const responseHeaders = {}
    if (options.emailAndPassword?.signUp?.autoLogin !== false) {
      // Set session cookie if auto login is enabled
      setSessionCookie(responseHeaders, session.token)
    }

    return {
      status: 200,
      body: {
        token: session.token,
        user: user,
      },
      headers: responseHeaders,
    }
  }

  return createEndpoint(schema, handler)
}
