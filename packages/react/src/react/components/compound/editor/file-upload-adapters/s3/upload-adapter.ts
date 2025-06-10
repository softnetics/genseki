import 'server-only'

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { GenericUploadAdapter, type UploadActionResponse } from '../generic-adapter'

export class UploadAdapterS3 extends GenericUploadAdapter {
  private static S3UploadAdapter: UploadAdapterS3
  private AWSClient: S3Client
  private bucket: string

  private constructor(options: { bucket: string; clientConfig: S3ClientConfig }) {
    super({ adapterName: 'S3' })

    this.AWSClient = new S3Client(options.clientConfig)
    this.bucket = options.bucket
  }

  // Incase where you need to create the client automatically
  public static createClient(options: { bucket: string; clientConfig: S3ClientConfig }) {
    if (!UploadAdapterS3.S3UploadAdapter) {
      UploadAdapterS3.S3UploadAdapter = new UploadAdapterS3(options)
    }

    return UploadAdapterS3.S3UploadAdapter
  }

  /**
   * @description Get the signed URL for reading the object from S3
   */
  public async getReadObjectSignedUrl(arg: {
    key: string
  }): Promise<UploadActionResponse<{ readObjectUrl: string }>> {
    const getCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: arg.key,
    })

    const url = await getSignedUrl(this.AWSClient, getCommand, {
      expiresIn: 3600,
    })

    return {
      message: 'Requested signed URL successfully',
      data: { readObjectUrl: url },
    }
  }

  /**
   * @description Get the signed URL for uploading the object to S3
   */
  public async getPutObjectSignedUrl(arg: {
    key: string
  }): Promise<UploadActionResponse<{ putObjectUrl: string }>> {
    const putCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: arg.key,
    })

    const uploadSignedUrl = await getSignedUrl(this.AWSClient, putCommand, { expiresIn: 3600 })

    return {
      message: 'File upload signed URL request success',
      data: { putObjectUrl: uploadSignedUrl },
    }
  }
}
