import z from 'zod'

import { ResponseHelper } from '../../../../core'
import type { AnyContextable } from '../../../../core/context'
import { createEndpoint } from '../../../../core/endpoint'
import type { EmailAndPasswordService } from '../service'

export function signOut<
  TContext extends AnyContextable,
  TService extends EmailAndPasswordService<TContext>,
>(service: TService) {
  return createEndpoint(
    service.context,
    {
      method: 'POST',
      path: '/auth/email-and-password/sign-out',
      body: undefined,
      responses: {
        200: z.object({
          success: z.boolean(),
        }),
      },
    },
    async (payload, { response }) => {
      const cookie = payload.context.getSessionCookie()

      if (!cookie) {
        ResponseHelper.deleteSessionCookie(response)
        throw new Error('No session cookie found')
      }

      await service.deleteSessionByToken(cookie)
      ResponseHelper.deleteSessionCookie(response)

      return {
        status: 200,
        body: { success: true },
      }
    }
  )
}
