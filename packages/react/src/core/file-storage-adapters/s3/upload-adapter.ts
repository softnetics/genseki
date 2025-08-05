import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import type { StorageAdapter } from '../generic-adapter'

export class StorageAdapterS3 implements StorageAdapter {
  private AWSClient: S3Client
  private bucket: string
  public name = 'S3'

  private constructor(options: { bucket: string; clientConfig: S3ClientConfig }) {
    this.AWSClient = new S3Client(options.clientConfig)
    this.bucket = options.bucket
  }

  // Incase where you need to create the client automatically
  public static initialize(options: { bucket: string; clientConfig: S3ClientConfig }) {
    return new StorageAdapterS3(options)
  }

  /**
   * @description Get the signed URL for reading the object from S3
   */
  public async generateGetObjectSignedUrl(arg: { key: string }) {
    const getCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: arg.key,
    })

    const url = await getSignedUrl(this.AWSClient, getCommand)

    return {
      message: 'Requested signed URL successfully',
      data: { readObjectUrl: url },
    }
  }

  /**
   * @description Get the signed URL for uploading the object to S3
   */
  public async generatePutObjectSignedUrl(arg: { key: string }) {
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
