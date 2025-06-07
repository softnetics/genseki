'use server'

import { z } from 'zod'

import { handleUploadAdapter } from './s3/handle-upload'
import { UploadAdapterS3 } from './s3/upload-adapter'
import type { UploadFunction } from './upload-adapter'

const AWScredentialsSchema = z.object({
  AWS_REGION: z.string({ message: 'AWS_REGION is required' }),
  AWS_SECRET_KEY: z.string({ message: 'AWS_SECRET_KEY is required' }),
  AWS_ACCESS_KEY_ID: z.string({ message: 'AWS_ACCESS_KEY_ID is required' }),
  AWS_BUCKET_NAME: z.string({ message: 'AWS_BUCKET_NAME is required' }),
})

const credentials = AWScredentialsSchema.parse(process.env)

const awsClient = UploadAdapterS3.createClient({
  bucket: credentials.AWS_BUCKET_NAME,
  clientConfig: {
    region: credentials.AWS_REGION,
    credentials: {
      secretAccessKey: credentials.AWS_SECRET_KEY,
      accessKeyId: credentials.AWS_ACCESS_KEY_ID,
    },
  },
})

export const uploadAction: UploadFunction = async (file) => {
  const actions = handleUploadAdapter(awsClient)

  const putObjectSignedUrl = await actions.getPutObjectSignedUrl(file)

  if (!putObjectSignedUrl.success) throw putObjectSignedUrl.message

  const putObjectResult = await actions.putObjectBySignedUrl(
    file,
    putObjectSignedUrl.data.putObjectUrl
  )

  if (!putObjectResult.success) throw putObjectResult.message

  return 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='
}
