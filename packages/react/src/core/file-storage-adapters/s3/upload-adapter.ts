import 'server-only'

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { StorageUploadAdapter, type UploadActionResponse } from '../generic-adapter'

export class StorageAdapterS3 extends StorageUploadAdapter {
  private static S3UploadAdapter: StorageAdapterS3
  private AWSClient: S3Client
  private bucket: string

  private constructor(options: { bucket: string; clientConfig: S3ClientConfig }) {
    super({ name: 'S3' })

    this.AWSClient = new S3Client(options.clientConfig)
    this.bucket = options.bucket
  }

  // Incase where you need to create the client automatically
  public static initailize(options: { bucket: string; clientConfig: S3ClientConfig }) {
    if (!StorageAdapterS3.S3UploadAdapter) {
      StorageAdapterS3.S3UploadAdapter = new StorageAdapterS3(options)
    }

    return StorageAdapterS3.S3UploadAdapter
  }

  /**
   * @description Get the signed URL for reading the object from S3
   */
  public async grabGetObjectSignedUrl(arg: {
    key: string
  }): Promise<UploadActionResponse<{ readObjectUrl: string }>> {
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
  public async grabPutObjectSignedUrl(arg: {
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

  async grabPermanentObjectUrl(arg: { key: string }): Promise<UploadActionResponse<any>> {
    const getCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: arg.key,
    })

    const response = await this.AWSClient.send(getCommand)

    return {
      message: 'Request object successfully',
      data: { response },
    }
  }
}
