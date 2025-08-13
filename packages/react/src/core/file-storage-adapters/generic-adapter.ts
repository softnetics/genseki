import type { createFileUploadHandlers } from './handlers'

import type { AnyContextable } from '../context'
import type { ApiRouter, ApiRouteSchemaClient } from '../endpoint'

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
  getApiRouter?: () => ApiRouter
  getImageBaseUrl?: () => string | undefined
}

export interface StorageAdapterClient {
  name: string
  grabPutObjectSignedUrlApiRoute: ApiRouteSchemaClient
  grabGetObjectSignedUrlApiRoute: ApiRouteSchemaClient
  imageBaseUrl?: string
}

export const getStorageAdapterClient = ({
  storageAdapter,
  grabPutObjectSignedUrlApiRoute,
  grabGetObjectSignedUrlApiRoute,
  apiPrefix = '/api',
}: {
  storageAdapter?: StorageAdapter
  grabPutObjectSignedUrlApiRoute?: ApiRouteSchemaClient
  grabGetObjectSignedUrlApiRoute?: ApiRouteSchemaClient
  apiPrefix?: string
}): StorageAdapterClient => {
  if (!storageAdapter) throw new Error('Upload adapter is missing')

  if (
    (!grabPutObjectSignedUrlApiRoute || !grabGetObjectSignedUrlApiRoute) &&
    storageAdapter.getApiRouter
  ) {
    const storageApi = storageAdapter.getApiRouter()
    const putRoute: any = (storageApi as any)?.storage?.putObjSignedUrl
    const getRoute: any = (storageApi as any)?.storage?.getObjSignedUrl

    grabPutObjectSignedUrlApiRoute ??= {
      method: putRoute?.schema?.method ?? 'GET',
      path: `${apiPrefix}${putRoute?.schema?.path ?? '/storage/put-obj-signed-url'}`,
    } as any

    grabGetObjectSignedUrlApiRoute ??= {
      method: getRoute?.schema?.method ?? 'GET',
      path: `${apiPrefix}${getRoute?.schema?.path ?? '/storage/get-obj-signed-url'}`,
    } as any
  }

  return {
    name: storageAdapter.name,
    grabPutObjectSignedUrlApiRoute: grabPutObjectSignedUrlApiRoute!,
    grabGetObjectSignedUrlApiRoute: grabGetObjectSignedUrlApiRoute!,
    imageBaseUrl: storageAdapter.getImageBaseUrl?.(),
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
