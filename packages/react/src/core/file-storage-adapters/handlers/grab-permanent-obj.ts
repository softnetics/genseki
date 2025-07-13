import z from 'zod/v4'

import type { AnyContextable } from '../../context'
import { createEndpoint } from '../../endpoint'
import type { StorageAdapter } from '../generic-adapter'

export function grabPermanentObject<const TContext extends AnyContextable>(
  context: TContext,
  uploadAdapter?: StorageAdapter
) {
  return createEndpoint(
    context,
    {
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
    },
    async (args) => {
      if (!uploadAdapter) throw new Error('Storage adpater is missing at server configuration')

      return {
        status: 200,
        body: {
          message: 'This route is for future use',
        },
      }
    }
  )
}
