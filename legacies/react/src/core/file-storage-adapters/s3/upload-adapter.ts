import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import type { AnyContextable } from '../../context'
import type { StorageAdapter } from '../generic-adapter'

export class StorageAdapterS3<TContext extends AnyContextable = AnyContextable>
  implements StorageAdapter<TContext>
{
  private AWSClient: S3Client
  private bucket: string
  public name = 'S3'

  public readonly context: TContext
  public imageBaseUrl: string

  private constructor(options: {
    bucket: string
    clientConfig: S3ClientConfig
    context: TContext
    imageBaseUrl: string
  }) {
    this.AWSClient = new S3Client(options.clientConfig)
    this.bucket = options.bucket
    this.context = options.context
    this.imageBaseUrl = options.imageBaseUrl
  }

  // Incase where you need to create the client automatically
  public static initialize(
    context: AnyContextable,
    options: { bucket: string; clientConfig: S3ClientConfig; imageBaseUrl: string }
  ) {
    return new StorageAdapterS3({
      context,
      bucket: options.bucket,
      clientConfig: options.clientConfig,
      imageBaseUrl: options.imageBaseUrl,
    })
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

  /**
   * @description Get the signed URL for deleting the object from S3
   */
  public async generateDeleteObjectSignedUrl(arg: { key: string }) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: arg.key,
    })

    const deleteSignedUrl = await getSignedUrl(this.AWSClient, deleteCommand, { expiresIn: 3600 })

    return {
      message: 'File delete signed URL request success',
      data: { deleteObjectUrl: deleteSignedUrl },
    }
  }
}
