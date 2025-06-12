export type UploadActionResponse<TData> = {
  message: string
  data: TData
}

export type UploadFunction = (
  file: File,
  onProgress: (event: { progress: number }) => void,
  abortSignal: AbortSignal
) => Promise<string>

export interface AdapterMethods<TGetPutUrl = any, TGetReadUrl = any> {
  getPutObjectSignedUrl(arg: { key: string }): Promise<UploadActionResponse<TGetPutUrl>>
  getReadObjectSignedUrl(arg: { key: string }): Promise<UploadActionResponse<TGetReadUrl>>
}

// Use this abstract class to create a new `UploadAdapter`
export abstract class GenericUploadAdapter<TGetPutUrl = any, TGetReadUrl = any>
  implements AdapterMethods<TGetPutUrl, TGetReadUrl>
{
  adapterName: string
  constructor(parameters: { adapterName: string }) {
    this.adapterName = parameters.adapterName
  }

  abstract getPutObjectSignedUrl(arg: { key: string }): Promise<UploadActionResponse<TGetPutUrl>>

  abstract getReadObjectSignedUrl(arg: { key: string }): Promise<UploadActionResponse<TGetReadUrl>>
}

export const handleUploadAdapter = <TGetPutUrl, TGetReadUrl>(
  adaptee: GenericUploadAdapter<TGetPutUrl, TGetReadUrl>
): AdapterMethods<TGetPutUrl, TGetReadUrl> => {
  // Middle ware
  const methods: AdapterMethods = {
    getPutObjectSignedUrl(...args) {
      return adaptee.getPutObjectSignedUrl(...args)
    },
    getReadObjectSignedUrl(...args) {
      return adaptee.getReadObjectSignedUrl(...args)
    },
  }

  return methods
}
