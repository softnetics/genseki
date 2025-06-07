'use server'
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { z } from 'zod'

const AWScredentialsSchema = z.object({
  AWS_REGION: z.string({ message: 'AWS_REGION is required' }),
  AWS_SECRET_KEY: z.string({ message: 'AWS_SECRET_KEY is required' }),
  AWS_ACCESS_KEY_ID: z.string({ message: 'AWS_ACCESS_KEY_ID is required' }),
  AWS_BUCKET_NAME: z.string({ message: 'AWS_BUCKET_NAME is required' }),
})

const getAWSClient = () => {
  const AWScredentials = AWScredentialsSchema.parse(process.env)

  const client = new S3Client({
    region: AWScredentials.AWS_REGION,
    credentials: {
      secretAccessKey: AWScredentials.AWS_SECRET_KEY,
      accessKeyId: AWScredentials.AWS_ACCESS_KEY_ID,
    },
  })

  return {
    client,
    options: {
      region: AWScredentials.AWS_REGION,
      bucketName: AWScredentials.AWS_BUCKET_NAME,
    },
  }
}

const checkHeadObject = async (
  name: string
): Promise<{
  error: boolean
  message: string
}> => {
  try {
    const {
      client,
      options: { bucketName },
    } = getAWSClient()

    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: name,
    })

    await client.send(command)
    return { error: true, message: 'File already exists' }
  } catch (error) {
    if (error instanceof S3ServiceException) {
      if (error.name === 'NotFound') return { error: false, message: 'File does not exist' }

      console.log('S3 Error:', error.name, error.message)
    }

    return { error: true, message: 'Unknown error' }
  }
}

export const getGetSignedUrl = async (
  name: string
): Promise<{
  error: boolean
  message: string
  url: string
}> => {
  const {
    client,
    options: { bucketName },
  } = getAWSClient()

  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: name,
  })

  const url = await getSignedUrl(client, getCommand, { expiresIn: 3600 })

  return { error: false, message: 'Presigned URL was generated', url }
}

export const getPutSignedUrl = async (
  file: File
): Promise<{ error: false; message: string; url: string } | { error: true; message: string }> => {
  try {
    const {
      client,
      options: { bucketName },
    } = getAWSClient()

    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: file.name,
    })

    const url = await getSignedUrl(client, putCommand, { expiresIn: 3600 })

    return { error: false, message: 'Presigned URL was generated', url: url }
  } catch (error) {
    if (error instanceof S3ServiceException) {
      console.log('S3 Error:', error.name, error.message)
      return { error: true, message: error.message }
    } else {
      console.log('Unknown error occured:', error)
      return { error: true, message: 'Unknown error occured' }
    }
  }
}
