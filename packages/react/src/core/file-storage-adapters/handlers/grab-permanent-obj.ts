import z from 'zod/v4'

import type { Context } from '../../context'
import { type ApiRouteHandler, type ApiRouteQuerySchema, createEndpoint } from '../../endpoint'
import type { StorageAdapter } from '../generic-adapter'

export function grabPermanentObject<const TContext extends Context>(
  uploadAdapter?: StorageAdapter
) {
  const schema = {
    method: 'GET',
    path: '/api/storage/permantent-obj',
    query: z.object({
      key: z.string(),
    }),
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
  } as const satisfies ApiRouteQuerySchema

  const handler: ApiRouteHandler<TContext, typeof schema> = async (args) => {
    if (!uploadAdapter) throw new Error('Storage adpater is missing at server configuration')

    const { message } = await uploadAdapter.grabPermanentObjectUrl({ key: args.query.key })

    return {
      status: 200,
      body: {
        message: message,
      },
    }
  }

  return createEndpoint(schema, handler)
}
