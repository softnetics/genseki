import 'server-only'

import {
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
  S3ServiceException,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { GenericUploadAdapter, type UploadActionResponse } from '../upload-adapter'

export class UploadAdapterS3 extends GenericUploadAdapter {
  private static S3UploadAdapter: UploadAdapterS3
  private AWSClient: S3Client
  private bucket: string

  private constructor(options: { bucket: string; clientConfig: S3ClientConfig }) {
    super({ adapterName: 'S3' })

    this.AWSClient = new S3Client(options.clientConfig)
    this.bucket = options.bucket
  }

  public static createClient(options: { bucket: string; clientConfig: S3ClientConfig }) {
    if (!UploadAdapterS3.S3UploadAdapter) {
      UploadAdapterS3.S3UploadAdapter = new UploadAdapterS3(options)
    }

    return UploadAdapterS3.S3UploadAdapter
  }

  public async getReadObjectSignedUrl(): Promise<UploadActionResponse<{ readObjectUrl: string }>> {
    try {
      // ...
      return {
        success: true,
        message: 'Fail to request signed URL',
        data: { readObjectUrl: '...' },
      }
    } catch (error) {
      if (error instanceof S3ServiceException) {
        console.error(`S3 Service error: ${error.name}`, error.message)
      } else {
        console.error(error)
      }

      return { success: false, message: 'Fail to request read object signed URL' }
    }
  }

  public async getPutObjectSignedUrl(
    file: File
  ): Promise<UploadActionResponse<{ putObjectUrl: string }>> {
    const putCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: file.name,
    })

    try {
      const uploadSignedUrl = await getSignedUrl(this.AWSClient, putCommand, { expiresIn: 3600 })

      return {
        success: true,
        message: 'File upload signed URL request success',
        data: { putObjectUrl: uploadSignedUrl },
      }
    } catch (error) {
      if (error instanceof S3ServiceException) {
        console.error(`S3 Service error: ${error.name}`, error.message)
      } else {
        console.error(error)
      }
      return { success: false, message: 'Fail to request put object signed URL' }
      /**
       * todo:
       * move error return to the expected case only for unknown case throw
       */
    }
  }

  public async putObjectBySignedUrl(file: File, url: string): Promise<UploadActionResponse<any>> {
    try {
      await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'Content-Length': file.size.toString(),
        },
      })

      return { success: true, message: 'Image upload successfully', data: null }
    } catch (error) {
      if (error instanceof S3ServiceException) {
        console.error(`S3 Service error: ${error.name}`, error.message)
      } else {
        console.error(error)
      }
      return { success: false, message: 'Fail to upload a new item to S3 with signed url' }
    }
  }
}
