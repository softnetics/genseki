import type { createFileUploadHandlers } from './handlers'

import type { AnyContextable } from '../context'
import type { ClientApiRouteSchema } from '../endpoint'

export type FileUploadHandlers = ReturnType<
  typeof createFileUploadHandlers<AnyContextable>
>['handlers']

export interface UploadActionResponse<TData> {
  message: string
  data: TData
}

/**
 * @description This function is used by file upload handler at client
 */
export type UploadFunction = (
  file: File,
  onProgress: (event: { progress: number }) => void,
  abortSignal: AbortSignal
) => Promise<{ key: string }>

export interface StorageAdapter {
  name: string
  generatePutObjectSignedUrl(arg: {
    key: string
  }): Promise<UploadActionResponse<{ putObjectUrl: string }>>
  generateGetObjectSignedUrl(arg: {
    key: string
  }): Promise<UploadActionResponse<{ readObjectUrl: string }>>
}

export interface StorageAdapterClient {
  name: string
  grabPutObjectSignedUrlApiRoute: ClientApiRouteSchema
  grabGetObjectSignedUrlApiRoute: ClientApiRouteSchema
}

export const getStorageAdapterClient = ({
  storageAdapter,
  grabPutObjectSignedUrlApiRoute,
  grabGetObjectSignedUrlApiRoute,
}: {
  storageAdapter?: StorageAdapter
  grabPutObjectSignedUrlApiRoute: ClientApiRouteSchema
  grabGetObjectSignedUrlApiRoute: ClientApiRouteSchema
}): StorageAdapterClient => {
  if (!storageAdapter) throw new Error('Upload adapter is missing')

  return {
    name: storageAdapter.name,
    grabPutObjectSignedUrlApiRoute,
    grabGetObjectSignedUrlApiRoute,
  }
}

export const handleStorageAdapter = (adapter: StorageAdapter): StorageAdapter => {
  // Middleware
  return {
    name: adapter.name,
    generatePutObjectSignedUrl(...args) {
      return adapter.generatePutObjectSignedUrl(...args)
    },
    generateGetObjectSignedUrl(...args) {
      return adapter.generateGetObjectSignedUrl(...args)
    },
  } satisfies StorageAdapter
}
