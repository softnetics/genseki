import z from 'zod/v4'

import type { AnyContextable } from '../../../../core/context'
import { createEndpoint } from '../../../../core/endpoint'
import { HttpUnauthorizedError } from '../../../../core/error'
import type { Fields } from '../../../../core/field'
import type { EmailAndPasswordService } from '../service'

export function resetPasswordEmail<
  TContext extends AnyContextable,
  TSignUpFields extends Fields,
  TService extends EmailAndPasswordService<TContext, TSignUpFields>,
>(service: TService) {
  return createEndpoint(
    service.context,
    {
      method: 'POST',
      path: '/auth/email-and-password/reset-password',
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
      },
    },
    async (payload, { response }) => {
      if (!service.options.resetPassword.enabled) {
        throw new HttpUnauthorizedError()
      }

      const verification = await service.validateResetPasswordToken(payload.query.token)

      await service.consumeResetPasswordToken({
        verificationId: verification.id,
        userId: verification.value!,
        rawPassword: payload.body.password,
      })

      response.headers.set('Location', service.options.resetPassword.successRedirectUrl)

      return {
        status: 200,
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
