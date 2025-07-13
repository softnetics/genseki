import z from 'zod/v4'

import type { AnyContextable } from '../../context'
import { type ApiRouteHandler, type ApiRouteSchema, createEndpoint } from '../../endpoint'
import type { StorageAdapter } from '../generic-adapter'

export function grabPutObjUrl<const TContext extends AnyContextable>(
  uploadAdapter?: StorageAdapter
) {
  const schema = {
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
  } as const satisfies ApiRouteSchema

  const handler: ApiRouteHandler<TContext, typeof schema> = async (args) => {
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

  return createEndpoint(schema, handler)
}
