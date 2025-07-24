import z from 'zod/v4'

import type { AnyContextable } from '../../../../core/context'
import { createEndpoint } from '../../../../core/endpoint'
import type { Fields } from '../../../../core/field'
import { ResponseHelper } from '../../../utils'
import type { EmailAndPasswordService } from '../service'

export function loginEmail<
  TContext extends AnyContextable,
  TSignUpFields extends Fields,
  TService extends EmailAndPasswordService<TContext, TSignUpFields>,
>(service: TService) {
  return createEndpoint(
    service.context,
    {
      method: 'POST',
      path: '/auth/email-and-password/login',
      body: z.object({
        email: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.object({
          success: z.boolean(),
        }),
      },
    },
    async (payload, { response }) => {
      const userId = await service.loginWithEmail(payload.body.email, payload.body.password)

      // Create session
      const { sessionToken, expiredAt } = await service.createSession({ userId: userId })
      ResponseHelper.setSessionCookie(response, sessionToken, { expiredAt })

      return {
        status: 200 as const,
        body: {
          success: true,
        },
      }
    }
  )
}
