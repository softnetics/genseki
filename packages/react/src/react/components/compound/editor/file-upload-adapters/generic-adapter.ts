export type UploadActionResponse<TData> = {
  message: string
  data: TData
}

export type UploadFunction = (
  file: File,
  onProgress: (event: { progress: number }) => void,
  abortSignal: AbortSignal
) => Promise<string>

export interface AdapterMethods<TGetPutUrl = any, TPutObject = any, TGetReadUrl = any> {
  getPutObjectSignedUrl(file: File): Promise<UploadActionResponse<TGetPutUrl>>
  putObjectBySignedUrl(file: File, url: string): Promise<UploadActionResponse<TPutObject>>
  getReadObjectSignedUrl(key: string): Promise<UploadActionResponse<TGetReadUrl>>
}

// Use this abstract class to create a new `UploadAdapter`
export abstract class GenericUploadAdapter<TGetPutUrl = any, TPutObject = any, TGetReadUrl = any>
  implements AdapterMethods<TGetPutUrl, TPutObject, TGetReadUrl>
{
  adapterName: string
  constructor(parameters: { adapterName: string }) {
    this.adapterName = parameters.adapterName
  }

  abstract getPutObjectSignedUrl(file: File): Promise<UploadActionResponse<TGetPutUrl>>

  abstract putObjectBySignedUrl(file: File, url: string): Promise<UploadActionResponse<TPutObject>>

  abstract getReadObjectSignedUrl(key: string): Promise<UploadActionResponse<TGetReadUrl>>
}

export const handleUploadAdapter = <TGetPutUrl, TPutObject, TGetReadUrl>(
  adaptee: GenericUploadAdapter<TGetPutUrl, TPutObject, TGetReadUrl>
): AdapterMethods<TGetPutUrl, TPutObject, TGetReadUrl> => {
  // Middle ware
  const methods: AdapterMethods = {
    getPutObjectSignedUrl(...args) {
      return adaptee.getPutObjectSignedUrl(...args)
    },
    getReadObjectSignedUrl(...args) {
      return adaptee.getReadObjectSignedUrl(...args)
    },
    putObjectBySignedUrl(...args) {
      return adaptee.putObjectBySignedUrl(...args)
    },
  }

  return methods
}
