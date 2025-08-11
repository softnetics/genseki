import { z } from 'zod'

import type { AnyContextable } from '../../../../core/context'
import { createEndpoint } from '../../../../core/endpoint'
import { HttpUnauthorizedError } from '../../../../core/error'
import type { EmailAndPasswordService } from '../service'

export function validateResetPasswordToken<
  TContext extends AnyContextable,
  TService extends EmailAndPasswordService<TContext>,
>(service: TService) {
  return createEndpoint(
    service.context,
    {
      method: 'POST',
      path: '/api/email-and-password/validate-reset-password-token',
      body: z.object({
        token: z.string(),
      }),
      responses: {
        200: z.object({
          expiredAt: z.string(),
        }),
      },
    },
    async (payload) => {
      if (!service.options.resetPassword.enabled) {
        throw new HttpUnauthorizedError()
      }

      const { expiredAt } = await service.validateResetPasswordToken(payload.body.token)

      return {
        status: 200,
        body: {
          expiredAt: expiredAt.toISOString(),
        },
      }
    }
  )
}
