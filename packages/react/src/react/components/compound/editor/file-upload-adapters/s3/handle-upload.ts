import type { AdapterMethods, GenericUploadAdapter } from '../upload-adapter'

export const handleUploadAdapter = (adaptee: GenericUploadAdapter) => {
  // Middle ware

  const methods: AdapterMethods = {
    getPutObjectSignedUrl(file) {
      return adaptee.getPutObjectSignedUrl(file)
    },
    getReadObjectSignedUrl() {
      return adaptee.getReadObjectSignedUrl()
    },
    putObjectBySignedUrl(...args) {
      return adaptee.putObjectBySignedUrl(...args)
    },
  }

  return methods
}
// const handleUpload: UploadFunction = async (file, inProgress, abortSignal) => {
//   try {
//     const signedUrlResponse = await S3.getUploadImageSignedUrl(file)

//     if (!signedUrlResponse.success) {
//       // Display toast
//       console.log(signedUrlResponse.error)
//       throw signedUrlResponse.error
//     }

//     const imageURL = await S3.getImage(file.name)

//     return 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='
//   } catch (error) {
//     console.log('ERROR from server action:', error)
//   }
//   //   await S3.getImage()
//   return 'some image url'
// }
