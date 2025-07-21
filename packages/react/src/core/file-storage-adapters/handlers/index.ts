import { grabGetObjUrl } from './grab-get-obj-signed-url'
import { grabPutObjUrl } from './grab-put-obj-signed-url'

import type { AnyContextable } from '../../context'
import type { StorageAdapter } from '../generic-adapter'

export function createFileUploadHandlers<TContext extends AnyContextable = AnyContextable>(
  context: TContext,
  uploadAdapter?: StorageAdapter
) {
  const handlers = {
    'file.generatePutObjSignedUrl': grabPutObjUrl<TContext>(context, uploadAdapter),
    'file.generateGetObjSignedUrl': grabGetObjUrl<TContext>(context, uploadAdapter),
  } as const

  return {
    handlers,
  }
}
