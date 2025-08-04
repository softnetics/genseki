import { createEndpoint } from '../../../core'
import { createPlugin } from '../../../core/config'
import type { Contextable } from '../../../core/context'
import type { Output } from '../../../core/endpoint'

export function mePlugin<TContext extends Contextable<any>>(context: TContext) {
  const meApi = createEndpoint(
    context,
    {
      method: 'GET',
      path: '/auth/me',
      responses: {
        200: context.getUserSchema() as Output<ReturnType<TContext['getUserSchema']>>,
      },
    },
    async (payload) => {
      const user = await payload.context.requiredAuthenticated()
      return {
        status: 200,
        body: user,
      } as any
    }
  )

  return createPlugin({
    name: 'auth',
    plugin: () => {
      return {
        api: {
          auth: meApi,
        },
        uis: [],
      }
    },
  })
}
