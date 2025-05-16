import z from 'zod'

import { ApiRoute, ApiRouteHandler, ApiRouteSchema } from '~/core/endpoint'

import { AccountProvider } from '../constant'
import { AuthContext } from '../context'
import { WithPrefix } from '../types'
import { setSessionCookie } from '../utils'

interface InternalRouteOptions {
  prefix?: string
}

export function signInEmail<const TOptions extends InternalRouteOptions>(options: TOptions) {
  const schema = {
    method: 'POST',
    path: (options.prefix ? `${options.prefix}/sign-in/email` : '/sign-in/email') as WithPrefix<
      TOptions['prefix'],
      '/sign-in/email'
    >,

    body: z.interface({
      email: z.string(),
      password: z.string(),
    }),
    responses: {
      200: z.interface({
        token: z.string().nullable(),
        user: z.interface({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          'image?': z.string().nullable(),
        }),
      }),
    },
  } satisfies ApiRouteSchema

  const handler: ApiRouteHandler<AuthContext, typeof schema> = async (args) => {
    console.log('signInEmail handler', args)

    // return {
    //   status: 200,
    //   headers: new Headers(),
    //   body: {
    //     token: 'test token',
    //     user: 'test user',
    //   },
    // }

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

    const responseHeaders = new Headers()
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

  return {
    ...schema,
    handler,
  } satisfies ApiRoute
}
