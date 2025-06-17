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

export interface StorageAdapter<TGetPutUrl = any, TGetReadUrl = any, TGetPermanentObjectUrl = any> {
  name: string
  grabPutObjectSignedUrl(arg: { key: string }): Promise<UploadActionResponse<TGetPutUrl>>
  grabGetObjectSignedUrl(arg: { key: string }): Promise<UploadActionResponse<TGetReadUrl>>
  grabPermanentObjectUrl(arg: {
    key: string
  }): Promise<UploadActionResponse<TGetPermanentObjectUrl>>
}

export interface StorageAdapterClient {
  name: string
  grabPutObjectSignedUrlApiRoute: ClientApiRouteSchema
  grabGetObjectSignedUrlApiRoute: ClientApiRouteSchema
  grabPermanentObjApiRoute: ClientApiRouteSchema
}

export const getStorageAdapterClient = ({
  storageAdapter,
  grabPutObjectSignedUrlApiRoute,
  grabGetObjectSignedUrlApiRoute,
  grabPermanentObjApiRoute,
}: {
  storageAdapter?: StorageAdapter
  grabPutObjectSignedUrlApiRoute: ClientApiRouteSchema
  grabGetObjectSignedUrlApiRoute: ClientApiRouteSchema
  grabPermanentObjApiRoute: ClientApiRouteSchema
}): StorageAdapterClient => {
  if (!storageAdapter) throw new Error('Upload adapter is missing')

  return {
    name: storageAdapter.name,
    grabPutObjectSignedUrlApiRoute,
    grabGetObjectSignedUrlApiRoute,
    grabPermanentObjApiRoute,
  }
}

// Use this abstract class to create a new `UploadAdapter`
export abstract class StorageUploadAdapter<
  TGetPutUrl = any,
  TGetReadUrl = any,
  TGetPermanentObjectUrl = any,
> implements StorageAdapter<TGetPutUrl, TGetReadUrl, TGetPermanentObjectUrl>
{
  name: string
  constructor(parameters: { name: string }) {
    this.name = parameters.name
  }

  abstract grabPutObjectSignedUrl(arg: { key: string }): Promise<UploadActionResponse<TGetPutUrl>>

  abstract grabGetObjectSignedUrl(arg: { key: string }): Promise<UploadActionResponse<TGetReadUrl>>

  abstract grabPermanentObjectUrl(arg: {
    key: string
  }): Promise<UploadActionResponse<TGetPermanentObjectUrl>>
}

export const handleUploadAdapter = <TGetPutUrl, TGetReadUrl, TGetPermanentObjectUrl>(
  adaptee: StorageUploadAdapter<TGetPutUrl, TGetReadUrl, TGetPermanentObjectUrl>
): StorageAdapter<TGetPutUrl, TGetReadUrl, TGetPermanentObjectUrl> => {
  // Middle ware
  return {
    name: adaptee.name,
    grabPutObjectSignedUrl(...args) {
      return adaptee.grabPutObjectSignedUrl(...args)
    },
    grabGetObjectSignedUrl(...args) {
      return adaptee.grabGetObjectSignedUrl(...args)
    },
    grabPermanentObjectUrl(...args) {
      return adaptee.grabPermanentObjectUrl(...args)
    },
  } satisfies StorageAdapter
}
