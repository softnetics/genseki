import z from 'zod/v4'

import type { AnyContextable } from '../../context'
import { createEndpoint } from '../../endpoint'
import type { StorageAdapter } from '../generic-adapter'

export function grabPutObjUrl<const TContext extends AnyContextable>(
  context: TContext,
  uploadAdapter?: StorageAdapter
) {
  return createEndpoint(
    context,
    {
      method: 'GET',
      path: '/api/storage/put-obj-signed-url',
      query: z.object({
        key: z.string(),
      }),
      responses: {
        200: z.object({
          message: z.string(),
          signedUrl: z.string(),
        }),
      },
    },
    async (args) => {
      if (!uploadAdapter) throw new Error('Storage adpater is missing at server configuration')

      const { message, data } = await uploadAdapter.generatePutObjectSignedUrl({
        key: args.query.key,
      })

      return {
        status: 200,
        body: {
          message: message,
          signedUrl: data.putObjectUrl,
        },
      }
    }
  )
}
