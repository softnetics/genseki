import { grabGetObjUrl } from './grab-get-obj-signed-url'
import { grabPutObjUrl } from './grab-put-obj-signed-url'

import type { Context } from '../../context'
import type { StorageAdapter } from '../generic-adapter'

export const createFileUploadHandlers = <TContext extends Context = Context>(
  uploadAdapter?: StorageAdapter
) => {
  const handlers = {
    'file.generatePutObjSignedUrl': grabPutObjUrl<TContext>(uploadAdapter),
    'file.generateGetObjSignedUrl': grabGetObjUrl<TContext>(uploadAdapter),
  }

  return {
    handlers,
  }
}
