import z from 'zod/v4'

import type { Context } from '../../core/context'
import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../core/endpoint'
import { AccountProvider } from '../constant'
import { type AuthContext } from '../context'
import { hashPassword, setSessionCookie } from '../utils'

export function signUp<const TAuthContext extends AuthContext, const TContext extends Context>(
  authContext: TAuthContext
) {
  const {
    authConfig: { emailAndPassword },
    internalHandlers,
  } = authContext
  const schema = {
    method: 'POST',
    path: '/api/auth/sign-up/email',
    body: z
      .object({
        name: z.string(),
        email: z.string(),
        password: z.string().min(6, { error: 'Password must be at least 6 characters' }),
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

  const handler: ApiRouteHandler<TContext, typeof schema> = async (args) => {
    const hashedPassword =
      (await emailAndPassword?.passwordHasher?.(args.body.password)) ??
      (await hashPassword(args.body.password))

    const user = await internalHandlers.user.create({
      name: args.body.name,
      email: args.body.email,
      image: null,
    })

    await internalHandlers.account.link({
      userId: user.id,
      providerId: AccountProvider.CREDENTIAL,
      accountId: user.id,
      password: hashedPassword,
    })

    // TODO: Check if sending email verification is enabled
    // NOTE: Callback URL is used for email verification

    // Check if auto login is enabled

    const responseHeaders = {}
    if (emailAndPassword?.signUp?.autoLogin !== false) {
      const session = await internalHandlers.session.create({
        userId: user.id,
        // TODO: Customize expiresAt
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      // Set session cookie if auto login is enabled
      setSessionCookie(responseHeaders, session.token)

      return {
        status: 200,
        body: {
          token: session.token,
          user: user,
        },
        headers: responseHeaders,
      }
    }

    return {
      status: 200,
      body: {
        token: null,
        user: user,
      },
      headers: responseHeaders,
    }
  }

  return createEndpoint(schema, handler)
}
