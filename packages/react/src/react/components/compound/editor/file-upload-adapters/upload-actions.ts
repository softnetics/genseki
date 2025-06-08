'use server'

import { z } from 'zod'

import { handleUploadAdapter, type UploadFunction } from './generic-adapter'
import { UploadAdapterS3 } from './s3/upload-adapter'

const AWScredentialsSchema = z.object({
  AWS_REGION: z.string({ message: 'AWS_REGION is required' }),
  AWS_SECRET_KEY: z.string({ message: 'AWS_SECRET_KEY is required' }),
  AWS_ACCESS_KEY_ID: z.string({ message: 'AWS_ACCESS_KEY_ID is required' }),
  AWS_BUCKET_NAME: z.string({ message: 'AWS_BUCKET_NAME is required' }),
})

const credentials = AWScredentialsSchema.parse(process.env)

export const uploadAction: UploadFunction = async (file) => {
  const actions = handleUploadAdapter(
    UploadAdapterS3.createClient({
      bucket: credentials.AWS_BUCKET_NAME,
      clientConfig: {
        region: credentials.AWS_REGION,
        credentials: {
          secretAccessKey: credentials.AWS_SECRET_KEY,
          accessKeyId: credentials.AWS_ACCESS_KEY_ID,
        },
      },
    })
  )

  // Get signed URL frm AWS for uploading
  const putObjectSignedUrl = await actions.getPutObjectSignedUrl(file)

  // Upload the object
  await actions.putObjectBySignedUrl(file, putObjectSignedUrl.data.putObjectUrl)

  // Get signed URL for reading
  const readObjectUrl = await actions.getReadObjectSignedUrl(file.name)

  return readObjectUrl.data.readObjectUrl
}
