import { grabGetObjUrl } from './grab-get-obj-signed-url'
import { grabPutObjUrl } from './grab-put-obj-signed-url'

import type { AnyContextable } from '../../context'
import type { StorageAdapter } from '../generic-adapter'

export const createFileUploadHandlers = <TContext extends AnyContextable = AnyContextable>(
  uploadAdapter?: StorageAdapter
) => {
  const handlers = {
    'file.generatePutObjSignedUrl': grabPutObjUrl<TContext>(uploadAdapter),
    'file.generateGetObjSignedUrl': grabGetObjUrl<TContext>(uploadAdapter),
  } as const

  return {
    handlers,
  }
}
