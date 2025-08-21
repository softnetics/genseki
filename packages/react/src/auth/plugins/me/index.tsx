import { createEndpoint, createPlugin } from '../../../core'
import type { Contextable } from '../../../core/context'

export function mePlugin<TContext extends Contextable<any>>(context: TContext) {
  const meApi = createEndpoint(
    context,
    {
      method: 'GET',
      path: '/auth/me',
      responses: {
        200: context.getUserSchema() as ReturnType<TContext['getUserSchema']>,
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

  return createPlugin('auth', (app) => {
    return app.addApiRouter({
      api: {
        me: meApi,
      },
    })
  })
}
