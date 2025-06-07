export type UploadActionResponse<TData extends Record<string, any> | null> =
  | {
      success: true
      message: string
      data: TData
    }
  | {
      success: false
      message: string
      error?: Error
    }

// Client side upload handler
export type UploadFunction = (
  file: File,
  onProgress: (event: { progress: number }) => void,
  abortSignal: AbortSignal
) => Promise<string>

export interface AdapterMethods {
  getPutObjectSignedUrl(file: File): Promise<UploadActionResponse<{ putObjectUrl: string }>>
  putObjectBySignedUrl(file: File, url: string): Promise<UploadActionResponse<null>>
  getReadObjectSignedUrl(): Promise<UploadActionResponse<{ readObjectUrl: string }>>
}

// Use this abstract class to create a new `UploadAdapter`
export abstract class GenericUploadAdapter implements AdapterMethods {
  adapterName: string
  constructor(parameters: { adapterName: string }) {
    this.adapterName = parameters.adapterName
  }

  abstract getPutObjectSignedUrl(
    file: File
  ): Promise<UploadActionResponse<{ putObjectUrl: string }>>

  abstract putObjectBySignedUrl(file: File, url: string): Promise<UploadActionResponse<any>>

  abstract getReadObjectSignedUrl(): Promise<UploadActionResponse<{ readObjectUrl: string }>>
}
