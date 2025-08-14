import type { createFileUploadHandlers } from './handlers'

import type { AnyContextable } from '../context'
import type { ApiRoutePath } from '../endpoint'

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

export interface StorageAdapter<TContext extends AnyContextable = AnyContextable> {
  name: string
  context: TContext
  imageBaseUrl: string
  generatePutObjectSignedUrl(arg: {
    key: string
  }): Promise<UploadActionResponse<{ putObjectUrl: string }>>
  generateGetObjectSignedUrl(arg: {
    key: string
  }): Promise<UploadActionResponse<{ readObjectUrl: string }>>
  generateDeleteObjectSignedUrl(arg: {
    key: string
  }): Promise<UploadActionResponse<{ deleteObjectUrl: string }>>
}

export interface StorageAdapterClient {
  name: string
  grabPutObjectSignedUrlApiRoute: ApiRoutePath
  grabGetObjectSignedUrlApiRoute: ApiRoutePath
  grabDeleteObjectSignedUrlApiRoute: ApiRoutePath
  imageBaseUrl?: string
}

export const getStorageAdapterClient = <TContext extends AnyContextable = AnyContextable>({
  storageAdapter,
  grabPutObjectSignedUrlApiRoute,
  grabGetObjectSignedUrlApiRoute,
  grabDeleteObjectSignedUrlApiRoute,
}: {
  storageAdapter?: StorageAdapter<TContext>
  grabPutObjectSignedUrlApiRoute: ApiRoutePath
  grabGetObjectSignedUrlApiRoute: ApiRoutePath
  grabDeleteObjectSignedUrlApiRoute: ApiRoutePath
}): StorageAdapterClient => {
  if (!storageAdapter) throw new Error('Upload adapter is missing')

  return {
    name: storageAdapter.name,
    grabPutObjectSignedUrlApiRoute,
    grabGetObjectSignedUrlApiRoute,
    grabDeleteObjectSignedUrlApiRoute,
    imageBaseUrl: storageAdapter.imageBaseUrl,
  }
}

export const handleStorageAdapter = <TContext extends AnyContextable = AnyContextable>(
  adapter: StorageAdapter<TContext>
): StorageAdapter<TContext> => {
  // Middleware
  return {
    name: adapter.name,
    context: adapter.context,
    imageBaseUrl: adapter.imageBaseUrl,
    generatePutObjectSignedUrl(...args) {
      return adapter.generatePutObjectSignedUrl(...args)
    },
    generateGetObjectSignedUrl(...args) {
      return adapter.generateGetObjectSignedUrl(...args)
    },
    generateDeleteObjectSignedUrl(...args) {
      return adapter.generateDeleteObjectSignedUrl(...args)
    },
  }
}
