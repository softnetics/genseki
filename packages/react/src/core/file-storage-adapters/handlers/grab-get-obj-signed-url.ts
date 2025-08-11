import z from 'zod'

import type { AnyContextable } from '../../context'
import { createEndpoint } from '../../endpoint'
import type { StorageAdapter } from '../generic-adapter'

export function grabGetObjUrl<const TContext extends AnyContextable>(
  context: TContext,
  uploadAdapter?: StorageAdapter
) {
  return createEndpoint(
    context,
    {
      method: 'GET',
      path: '/api/storage/get-obj-signed-url',
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

      // TODO: Mkae this Type safe
      const { message, data } = await uploadAdapter.generateGetObjectSignedUrl({
        key: args.query.key,
      })

      return {
        status: 200,
        body: {
          message: message,
          signedUrl: data.readObjectUrl,
        },
      }
    }
  )
}
