import z from 'zod/v4'

import type { Contextable } from '../../core/context'
import { createEndpoint } from '../../core/endpoint'
import type { AuthApiBuilderArgs, AuthOptions } from '..'
import { hashPassword } from '../utils'

export function resetPasswordEmail<TContext extends Contextable, TAuthOptions extends AuthOptions>(
  builderArgs: AuthApiBuilderArgs<TContext, TAuthOptions>
) {
  return createEndpoint(
    builderArgs.context,
    {
      method: 'POST',
      path: '/auth/reset-password',
      query: z.object({
        token: z.string(),
      }),
      body: z.object({
        password: z.string(),
      }),
      responses: {
        200: z.object({
          status: z.string(),
        }),
        400: z.object({
          status: z.string(),
        }),
      },
    },
    async (args) => {
      if (!builderArgs.options.method.emailAndPassword?.resetPassword?.enabled) {
        // TODO: Log not enabled
        return {
          status: 400,
          body: { status: 'reset password not enabled' },
        }
      }

      const verification = await builderArgs.handler.verification.findByIdentifier(
        builderArgs.handler.identifier.resetPassword(args.query.token)
      )

      if (!verification || !verification.value) {
        return {
          status: 400,
          body: { status: 'invalid reset password value' },
        }
      }

      const user = await builderArgs.handler.user.findById(verification.value)

      if (!user) {
        return {
          status: 400,
          body: { status: 'user not found' },
        }
      }

      if (verification.expiresAt < new Date()) {
        return {
          status: 400,
          body: { status: 'reset password token expired' },
        }
      }

      // delete the verification token
      await builderArgs.handler.verification.deleteByIdentifier(
        builderArgs.handler.identifier.resetPassword(args.query.token)
      )

      const hashedPassword = await hashPassword(args.body.password)
      await builderArgs.handler.account.updatePassword(user.id, hashedPassword)

      // const redirectTo = `${builderArgs.options.method.emailAndPassword?.resetPassword?.redirectTo ?? '/auth/login'}`
      const redirectTo = '/auth/login'

      const responseHeaders = {
        Location: redirectTo,
      }

      return {
        status: 200,
        headers: responseHeaders,
        body: { status: 'ok' },
      }
    }
  )
}

export function validateVerification(verification?: {
  id: string
  identifier: string
  value: string | null
  expiresAt: Date
}) {
  if (!verification) {
    return null
  }
  if (verification.expiresAt < new Date()) {
    return null
  }
  return {
    id: verification.id,
    identifier: verification.identifier,
    value: verification.value,
    expiresAt: verification.expiresAt.toISOString(),
  }
}

export function validateResetToken<TContext extends Contextable, TAuthOptions extends AuthOptions>(
  builderArgs: AuthApiBuilderArgs<TContext, TAuthOptions>
) {
  return createEndpoint(
    builderArgs.context,
    {
      method: 'POST',
      path: '/api/auth/validate-reset-password-token',
      body: z.object({
        token: z.string(),
      }),
      responses: {
        200: z.object({
          verification: z
            .object({
              id: z.string(),
              identifier: z.string(),
              value: z.string().nullable(),
              expiresAt: z.string(),
            })
            .nullable(),
        }),
      },
    },
    async (args) => {
      try {
        const verification = await builderArgs.handler.verification.findByIdentifier(
          builderArgs.handler.identifier.resetPassword(args.body.token)
        )

        const validatedVerification = validateVerification(verification)

        if (!validatedVerification) {
          return {
            status: 200,
            body: { verification: null },
          }
        }

        return {
          status: 200,
          body: {
            verification: validatedVerification,
          },
        }
      } catch {
        return {
          status: 200,
          body: { verification: null },
        }
      }
    }
  )
}
