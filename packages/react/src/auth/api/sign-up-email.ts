import z from 'zod/v4'

import type { Contextable } from '../../core/context'
import { createEndpoint } from '../../core/endpoint'
import type { AuthApiBuilderArgs, AuthOptions } from '..'
import { ResponseHelper } from '../utils'

export function signUpEmail<TContext extends Contextable, TAuthOptions extends AuthOptions>(
  builderArgs: AuthApiBuilderArgs<TContext, TAuthOptions>
) {
  return createEndpoint(
    builderArgs.context,
    {
      method: 'POST',
      path: '/auth/sign-up/email',
      body: z
        .object({
          name: z.string().nullable().optional(),
          email: z.string(),
          password: z.string().min(6, { error: 'Password must be at least 6 characters' }),
        })
        .and(z.record(z.string(), z.any())),
      responses: {
        200: z.object({
          token: z.string().nullable(),
          user: z.object({
            id: z.string(),
            name: z.string().nullable().optional(),
            email: z.string(),
            image: z.string().nullable().optional(),
          }),
        }),
      },
    },
    async (args, { response }) => {
      const { user } = await builderArgs.handler.user.createWithEmail({
        user: {
          name: args.body.name ?? null,
          email: args.body.email,
        },
        account: {
          rawPassword: args.body.password,
        },
      })

      // TODO: Check if sending email verification is enabled
      // NOTE: Callback URL is used for email verification

      if (builderArgs.options.method.emailAndPassword?.signUp?.autoLogin !== false) {
        const session = await builderArgs.handler.session.create({
          userId: user.id,
          // TODO: Customize expiresAt
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        })
        // Set session cookie if auto login is enabled
        ResponseHelper.setSessionCookie(response, session.token)

        return {
          status: 200,
          body: {
            token: session.token,
            user: {
              ...user,
              email: args.body.email,
            },
          },
        }
      }

      return {
        status: 200,
        body: {
          token: null,
          user: {
            ...user,
            email: args.body.email,
          },
        },
      }
    }
  )
}
