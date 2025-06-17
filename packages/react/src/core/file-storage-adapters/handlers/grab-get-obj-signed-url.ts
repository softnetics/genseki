import z from 'zod/v4'

import type { Context } from '../../context'
import { type ApiRouteHandler, type ApiRouteQuerySchema, createEndpoint } from '../../endpoint'
import type { StorageAdapter } from '../generic-adapter'

export function grabGetObjUrl<const TContext extends Context>(uploadAdapter?: StorageAdapter) {
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
  } as const satisfies ApiRouteQuerySchema

  const handler: ApiRouteHandler<TContext, typeof schema> = async (args) => {
    if (!uploadAdapter) throw new Error('Storage adpater is missing at server configuration')

    // TODO: Mkae this Type safe
    const { message, data } = await uploadAdapter.grabGetObjectSignedUrl({ key: args.query.key })

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
