import z from 'zod/v4'

import type { AnyContextable } from '../../../../core/context'
import { createEndpoint } from '../../../../core/endpoint'
import { HttpUnauthorizedError } from '../../../../core/error'
import type { Fields } from '../../../../core/field'
import type { EmailAndPasswordService } from '../service'

export function requestResetPassword<
  TContext extends AnyContextable,
  TSignUpFields extends Fields,
  TService extends EmailAndPasswordService<TContext, TSignUpFields>,
>(service: TService) {
  return createEndpoint(
    service.context,
    {
      method: 'POST',
      path: '/auth/email-and-password/request-reset-password',
      body: z.object({
        email: z.string(),
      }),
      responses: {
        200: z.object({
          success: z.boolean(),
        }),
      },
    },
    async (args) => {
      if (!service.options.resetPassword.enabled) {
        throw new HttpUnauthorizedError()
      }

      const payload = await service.requestResetPassword(args.body.email)

      // Send email
      if (service.options.resetPassword.sendEmailResetPassword) {
        await service.options.resetPassword.sendEmailResetPassword({
          ...payload,
          redirectUrl: `${service.options.resetPassword.resetPasswordUrl}?token=${payload.token}`,
        })
      } else {
        // Fallback to console log for development
        console.warn(
          'No "resetPassword.sendEmailResetPassword" function provided, using console.log for development purposes.'
        )
      }

      return {
        status: 200,
        body: {
          success: true,
        },
      }
    }
  )
}
