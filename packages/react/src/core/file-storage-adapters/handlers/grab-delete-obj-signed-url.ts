import z from 'zod'

import type { AnyContextable } from '../../context'
import { createEndpoint } from '../../endpoint'
import type { StorageAdapter } from '../generic-adapter'

export function grabDeleteObjUrl<const TContext extends AnyContextable>(
  context: TContext,
  uploadAdapter?: StorageAdapter
) {
  return createEndpoint(
    context,
    {
      method: 'DELETE',
      path: '/storage/delete-obj-signed-url',
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
      if (!uploadAdapter) throw new Error('Storage adapter is missing at server configuration')

      const { message, data } = await uploadAdapter.generateDeleteObjectSignedUrl({
        key: args.query.key,
      })

      return {
        status: 200,
        body: {
          message: message,
          signedUrl: data.deleteObjectUrl,
        },
      }
    }
  )
}
