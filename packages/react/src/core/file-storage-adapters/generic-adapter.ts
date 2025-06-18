import type { createFileUploadHandlers } from './handlers'

import type { Context } from '../context'
import type { ClientApiRouteSchema } from '../endpoint'

export type FileUploadHandlers = ReturnType<
  typeof createFileUploadHandlers<Context<any, any, any>>
>['handlers']

export type UploadActionResponse<TData> = {
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
) => Promise<string>

export interface StorageAdapter {
  name: string
  grabPutObjectSignedUrl(arg: {
    key: string
  }): Promise<UploadActionResponse<{ putObjectUrl: string }>>
  grabGetObjectSignedUrl(arg: {
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
  // Middle ware
  return {
    name: adapter.name,
    grabPutObjectSignedUrl(...args) {
      return adapter.grabPutObjectSignedUrl(...args)
    },
    grabGetObjectSignedUrl(...args) {
      return adapter.grabGetObjectSignedUrl(...args)
    },
  } satisfies StorageAdapter
}
