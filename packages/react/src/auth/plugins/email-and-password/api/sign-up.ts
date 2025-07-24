import z from 'zod/v4'

import type { AnyContextable } from '../../../../core/context'
import { createEndpoint } from '../../../../core/endpoint'
import type { Fields } from '../../../../core/field'
import { ResponseHelper } from '../../../utils'
import type { EmailAndPasswordService } from '../service'

export function signUpEmail<
  TContext extends AnyContextable,
  TSignUpFields extends Fields,
  TService extends EmailAndPasswordService<TContext, TSignUpFields>,
>(service: TService) {
  return createEndpoint(
    service.context,
    {
      method: 'POST',
      path: '/auth/email-and-password/sign-up',
      // TODO: Make it type-safe
      body: z.any(),
      responses: {
        200: z.object({
          success: z.boolean(),
        }),
      },
    },
    async (args, { response }) => {
      const { user } = await service.createUserWithEmail({
        user: args.body.user,
        account: {
          rawPassword: args.body.account.rawPassword,
        },
      })

      if (service.options.signUp.autoLogin) {
        const { sessionToken, expiredAt } = await service.createSession({
          userId: user.id,
        })
        ResponseHelper.setSessionCookie(response, sessionToken, { expiredAt })
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
