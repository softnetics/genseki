import z from 'zod/v4'

import type { AnyContextable } from '../../context'
import type { ApiRouteHandler, ApiRouteSchema } from '../../endpoint'
import { createEndpoint } from '../../endpoint'
import type { StorageAdapter } from '../generic-adapter'

export function grabGetObjUrl<const TContext extends AnyContextable>(
  uploadAdapter?: StorageAdapter
) {
  const schema = {
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
  } as const satisfies ApiRouteSchema

  const handler: ApiRouteHandler<TContext, typeof schema> = async (args) => {
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

  return createEndpoint(schema, handler)
}
