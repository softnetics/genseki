'use client'
import React, { type Dispatch, type SetStateAction, useRef, useState } from 'react'
import type { DropZoneProps } from 'react-aria-components'

import {
  CheckCircleIcon,
  CloudArrowUpIcon,
  FileIcon,
  PaperclipIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type { DropEvent, FileDropItem } from '@react-types/shared'
import { toast } from 'sonner'

import { mimeTypeValidate } from '../../../core/utils'
import { useStorageAdapter } from '../../providers/root'
import { isImageKey } from '../../utils/is-image-key'
import {
  AriaDescription,
  AriaLabel,
  BaseIcon,
  Button,
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ProgressBar,
  Typography,
} from '../primitives'
import { CustomFieldError } from '../primitives/custom-field-error'
import { DropZone } from '../primitives/drop-zone'

/**
 * @description Generates a signed URL for uploading a file to object storage by making a request to the provided path with the file key
 */
export const generatePutObjSignedUrlData = async (
  path: string,
  key: string
): Promise<{ ok: true; data: any } | { ok: false; message: string }> => {
  try {
    const putObjUrlEndpoint = new URL(path, window.location.origin)

    putObjUrlEndpoint.searchParams.append('key', key)

    const putObjSignedUrl = await fetch(putObjUrlEndpoint.toString())

    return {
      ok: true,
      data: await putObjSignedUrl.json(),
    }
  } catch (error) {
    const message = (error as Error).message

    return {
      ok: false,
      message: message,
    }
  }
}

/**
 * @description Generates a signed URL for deleting a file from object storage
 */
export const generateDeleteObjSignedUrlData = async (
  path: string,
  key: string
): Promise<{ ok: true; data: any } | { ok: false; message: string }> => {
  try {
    const deleteObjUrlEndpoint = new URL(path, window.location.origin)

    deleteObjUrlEndpoint.searchParams.append('key', key)

    const deleteObjSignedUrl = await fetch(deleteObjUrlEndpoint.toString())

    return {
      ok: true,
      data: await deleteObjSignedUrl.json(),
    }
  } catch (error) {
    const message = (error as Error).message

    return {
      ok: false,
      message: message,
    }
  }
}

/**
 * @description Uploads a file using a signed URL
 */
export const uploadObject = async (
  signedUrl: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ ok: true } | { ok: false; message: string }> => {
  try {
    const res: { ok: true } = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', signedUrl)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100)
          onProgress(percent)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve({ ok: true })
        } else {
          reject({ ok: false, message: `HTTP ${xhr.status} ${xhr.statusText}` })
        }
      }

      xhr.onerror = () => reject({ ok: false, message: 'Network error' })

      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })

    return res
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return { ok: false, message: error.message }
    }

    return { ok: false, message: 'Upload error' }
  }
}

/**
 * @description Deletes a file using a signed URL
 */
export const deleteObject = async (
  signedUrl: string
): Promise<{ ok: true } | { ok: false; message: string }> => {
  try {
    const response = await fetch(signedUrl, {
      method: 'DELETE',
    })

    if (response.ok) {
      return { ok: true }
    } else {
      return { ok: false, message: `HTTP ${response.status} ${response.statusText}` }
    }
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return { ok: false, message: error.message }
    }

    return { ok: false, message: 'Delete error' }
  }
}

export interface FileUploadOptionsProps {
  mimeTypes?: string[]
  maxSize?: number // Bytes (Default is 1024 * 1024 = 1 MB)
  /**
   * @description For now we accept only 1 file at a time (Collection constract accept only one key)
   */
  limit?: 1
  accept?: string
  pathName?: string
}

export interface FileUploadFieldProps extends DropZoneProps {
  value?: string
  name?: string
  label?: string
  placeholder?: string
  description?: string
  isRequired?: boolean
  hintText?: string
  errorMessage?: string
  uploadOptions?: FileUploadOptionsProps
  onUpload?: (files: File[], setFileKey: Dispatch<SetStateAction<string | undefined>>) => void
  onUploadSuccess?: (fileKey: string) => void
  onUploadFail?: (reason: string) => void
  onRemove?: (fileKey: string) => void
  onRemoveSuccess?: (fileKey: string) => void
  onRemoveFail?: (reason: string) => void
}

export const FileUploadField = (props: FileUploadFieldProps) => {
  const [fileKey, setFileKey] = useState(props.value)
  const [uploadStatus, setUploadStatus] = useState<'pending' | 'success' | 'failed' | undefined>(
    undefined
  )
  const [deleteStatus, setDeleteStatus] = useState<'pending' | 'success' | 'failed' | undefined>(
    undefined
  )
  const storageAdapter = useStorageAdapter()
  const inputRef = useRef<HTMLInputElement>(null)
  const maxSize = props.uploadOptions?.maxSize || 1024 * 1024 * 1
  const readableMaxSize = `${maxSize / 1024 / 1024}MB`
  const limit = props.uploadOptions?.limit || 1
  const mimeTypes = props.uploadOptions?.mimeTypes || []
  const accept = props.uploadOptions?.accept || undefined
  const pathName = props.uploadOptions?.pathName
  const readableMimeTypes = mimeTypes.map((mimeType) => mimeType.split('/')[1]).join(', ')
  const imageBaseUrl = storageAdapter.imageBaseUrl
  const hintText = props.hintText || `${readableMimeTypes} (max. ${readableMaxSize})`

  // Upload progress
  const [progress, setProgress] = useState<number | undefined>(undefined)
  const [tempFileKey, setTempFileKey] = useState<string | undefined>(undefined)

  const handleUpload = async (files: File[]) => {
    // Custom handle on your own
    setUploadStatus('pending')
    setProgress(0)

    if (props.onUpload) {
      props.onUpload(files, setFileKey)
      return
    }

    // Check for storage adapter availability
    if (!storageAdapter) {
      toast.error('Storage adapter is missing', {
        description: 'Check the config file if you have provided the adapter',
      })
      props.onUploadFail?.('Storage adapter is missing')
      return
    }

    // Show toast if file amount is exceed
    if (files.length > limit) {
      toast.error(`Maximum attachment amount ${limit > 1 ? 'are' : 'is'} ${limit}`)
      props.onUploadFail?.('File size exceed the limit')
      return
    }

    // Show toast if file size exceed the max size or invalid MIME type
    for (const file of files) {
      const mimeValidateResult = mimeTypeValidate(mimeTypes, file.type)
      if (!mimeValidateResult) {
        toast.error(
          `File type is not allowed, only ${readableMimeTypes} ${mimeTypes.length > 1 ? 'are' : 'is'} allowed`,
          {
            description: `${file.name} is ${file.type} which is not allowed`,
          }
        )
        props.onUploadFail?.('File type is not allowed')
        setUploadStatus('failed')
        return
      }

      if (file.size > maxSize) {
        toast.error(`File size exceed over ${readableMaxSize}`, {
          description: `${file.name} exceeded the file size limit`,
        })
        props.onUploadFail?.('File size exceed the limit')
        return
      }
    }

    // TODO: Allow for multiples file, currently one at a time
    const targetFile = files[0]
    const name = targetFile.name.split('.').slice(0, -1).join('.')
    const extension = targetFile.name.split('.').pop()

    const key = `${pathName ? `${pathName}/` : ''}${name}-${crypto.randomUUID()}.${extension}`
    setTempFileKey(key)

    const signedUrlPath = storageAdapter.grabPutObjectSignedUrlApiRoute.path

    if (!signedUrlPath) {
      toast.error('Storage adapter is missing', {
        description: 'Check the config file if you have provided the adapter',
      })
      props.onUploadFail?.('Storage adapter is missing')
      return
    }

    // Get signed URL
    const putObjSignedUrl = await generatePutObjSignedUrlData(signedUrlPath, key)

    if (!putObjSignedUrl.ok) {
      props.onUploadFail?.(putObjSignedUrl.message || 'generating put object signed URL error')
      toast.error('generating put object signed URL error', {
        description: putObjSignedUrl.message,
      })
      setUploadStatus('failed')
      return
    }

    // Upload file using signed URL
    const uploadResult = await uploadObject(putObjSignedUrl.data.body.signedUrl, targetFile, (p) =>
      setProgress(p)
    )

    if (!uploadResult.ok) {
      props.onUploadFail?.(uploadResult.message || 'File upload error')
      if (uploadResult.message === 'Upload aborted') {
        setTempFileKey(undefined)
      }
      toast.error('File upload error', {
        description: uploadResult.message,
      })
      setUploadStatus('failed')
      setProgress(undefined)
      return
    }

    setFileKey(key)
    props.onUploadSuccess?.(key)
    setUploadStatus('success')
    setProgress(undefined)
  }

  const handleRemove = async (fileKey: string) => {
    if (props.onRemove) {
      props.onRemove(fileKey)
      return
    }

    setDeleteStatus('pending')

    if (!storageAdapter) {
      toast.error('Storage adapter is missing', {
        description: 'Check the config file if you have provided the adapter',
      })
      props.onRemoveFail?.('Storage adapter is missing')
      setDeleteStatus('failed')
      return
    }

    const deleteSignedUrlPath = storageAdapter.grabDeleteObjectSignedUrlApiRoute?.path

    if (!deleteSignedUrlPath) {
      toast.error('Delete functionality not configured', {
        description: 'Delete API route is not configured in the storage adapter',
      })
      props.onRemoveFail?.('Delete functionality not configured')
      setDeleteStatus('failed')
      return
    }

    try {
      const deleteObjSignedUrl = await generateDeleteObjSignedUrlData(deleteSignedUrlPath, fileKey)

      if (!deleteObjSignedUrl.ok) {
        props.onRemoveFail?.(
          deleteObjSignedUrl.message || 'generating delete object signed URL error'
        )
        toast.error('generating delete object signed URL error', {
          description: deleteObjSignedUrl.message,
        })
        setDeleteStatus('failed')
        return
      }

      const deleteResult = await deleteObject(deleteObjSignedUrl.data.body.signedUrl)

      if (!deleteResult.ok) {
        props.onRemoveFail?.(deleteResult.message || 'File delete error')
        toast.error('File delete error', {
          description: deleteResult.message,
        })
        setDeleteStatus('failed')
        return
      }

      setFileKey(undefined)
      setUploadStatus(undefined)
      setDeleteStatus('success')
      props.onRemoveSuccess?.(fileKey)
      toast.success('File deleted successfully')
    } catch (error) {
      const message = (error as Error).message
      props.onRemoveFail?.(message || 'Remove file fail')
      toast.error('Remove file fail', { description: message })
      setDeleteStatus('failed')
    }
  }

  // For upload via clicking
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files || files.length === 0) return

    handleUpload(Array.from(files))
  }

  // For upload via drag-n-drop
  const handleDrop = async ({ items }: DropEvent) => {
    if (items.length === 0) return

    if (items.some((item) => item.kind !== 'file')) {
      toast.error('Only file type is accepted')
      return
    }

    const files = await Promise.all(items.map((item) => (item as FileDropItem).getFile()))

    handleUpload(files)
  }

  return (
    <div className="group flex flex-col gap-y-4">
      {props.label && (
        <AriaLabel htmlFor={props.name}>
          {props.label} {props.isRequired && <span className="ml-1 text-text-brand">*</span>}
        </AriaLabel>
      )}
      {fileKey ? (
        <FileDisplayer
          imageBaseUrl={imageBaseUrl}
          uploadStatus={uploadStatus}
          deleteStatus={deleteStatus}
          fileKey={fileKey}
          onRemove={handleRemove}
        />
      ) : (
        <div>
          {progress && tempFileKey && uploadStatus === 'pending' ? (
            <FileUploadProgress fileKey={tempFileKey} value={progress} />
          ) : (
            <div>
              <DropZone
                onDrop={handleDrop}
                isDisabled={props.isDisabled || uploadStatus === 'pending'}
                className="border border-bluegray-400 bg-white rounded-lg"
              >
                <div className="flex flex-col items-center gap-6">
                  <Button
                    leadingIcon={<BaseIcon icon={PaperclipIcon} size="md" />}
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      inputRef.current?.click()
                    }}
                  >
                    Upload a file
                  </Button>
                  <div className="flex flex-col items-center gap-y-4 mt-4">
                    <Typography type="body" weight="medium" className="text-muted-fg text-center">
                      {props.placeholder || (
                        <>
                          <span
                            className="text-ocean-500 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              inputRef.current?.click()
                            }}
                          >
                            Click to upload
                          </span>{' '}
                          or drag and drop
                        </>
                      )}
                      <br />
                      <span>{hintText}</span>
                    </Typography>

                    {/* <Typography type="caption" weight="normal" className="text-text-secondary">
                  Maximum file size {readableMaxSize}.
                </Typography> */}
                  </div>
                </div>
              </DropZone>
              <input
                id={props.name}
                type="file"
                multiple={false}
                ref={inputRef}
                onChange={handleChange}
                className="hidden"
                accept={accept}
                disabled={props.isDisabled}
              />
            </div>
          )}
        </div>
      )}
      {props.description && <AriaDescription>{props.description}</AriaDescription>}
      <CustomFieldError errorMessage={props.errorMessage} />
    </div>
  )
}

const FileDisplayer = (props: {
  fileKey: string
  uploadStatus?: 'pending' | 'success' | 'failed'
  deleteStatus?: 'pending' | 'success' | 'failed'
  imageBaseUrl?: string
  onRemove: (fileKey: string) => void
}) => {
  const isImage = isImageKey(props.fileKey)

  const statusVariant = {
    pending: {
      icon: <BaseIcon icon={CloudArrowUpIcon} size="sm" className="text-muted-fg" />,
      text: (
        <Typography type="body" weight="medium" className="text-muted-fg text-sm">
          Pending
        </Typography>
      ),
    },
    success: {
      icon: <BaseIcon icon={CheckCircleIcon} size="sm" className="text-palm-600" />,
      text: (
        <Typography type="body" weight="medium" className="text-muted-fg text-sm">
          Completed
        </Typography>
      ),
    },
    failed: {
      icon: <BaseIcon icon={XCircleIcon} size="sm" className="text-red-600" />,
      text: (
        <Typography type="body" weight="medium" className="text-red-600 text-sm">
          Failed
        </Typography>
      ),
    },
  }

  const isDeleting = props.deleteStatus === 'pending'
  return (
    <div className="w-full h-full bg-white dark:bg-transparent rounded-md p-8 items-center gap-x-4 border border-bluegray-300 dark:border-bluegray-700">
      <div className="flex gap-x-4 items-start">
        {isImage && props.imageBaseUrl ? (
          <div className="size-20 rounded-md overflow-hidden bg-muted border border-bluegray-300">
            <img
              src={`${props.imageBaseUrl}/${props.fileKey}`}
              alt={props.fileKey}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <BaseIcon icon={FileIcon} size="xl" />
        )}
        <div className="flex flex-col gap-4">
          <Typography type="body" weight="medium" className="text-muted-fg" content={props.fileKey}>
            {props.fileKey.split('/').pop() || ''}
          </Typography>

          {(props.uploadStatus || props.deleteStatus) && (
            <div className="flex gap-2 items-center text-muted-fg">
              {props.deleteStatus ? (
                <>
                  {statusVariant[props.deleteStatus].icon}
                  {statusVariant[props.deleteStatus].text}
                </>
              ) : props.uploadStatus ? (
                <>
                  {statusVariant[props.uploadStatus].icon}
                  {statusVariant[props.uploadStatus].text}
                </>
              ) : null}
            </div>
          )}

          <div className="flex gap-6 items-center">
            <Modal>
              <Button variant="destruction" size="xs" isDisabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Remove'}
              </Button>
              <ModalContent isBlurred role="alertdialog">
                <ModalHeader className="">
                  <ModalTitle level={3}>Delete file</ModalTitle>
                  <ModalDescription>
                    This will permanently delete the selected file
                  </ModalDescription>
                </ModalHeader>
                <ModalFooter className="flex justify-between">
                  <ModalClose variant="outline" size="sm">
                    Cancel
                  </ModalClose>
                  <ModalClose
                    variant="destruction"
                    size="sm"
                    onClick={() => props.onRemove(props.fileKey)}
                    isDisabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </ModalClose>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

const FileUploadProgress = (props: {
  fileKey: string
  value: number
  uploadStatus?: 'pending' | 'success' | 'failed'
}) => {
  return (
    <div className="w-full h-full bg-white dark:bg-transparent rounded-md p-8 items-center gap-x-4 border border-bluegray-300 dark:border-bluegray-700">
      <div className="flex gap-x-4 items-start">
        <BaseIcon icon={FileIcon} size="xl" />
        <div className="flex flex-col gap-4 w-full">
          <Typography type="body" weight="medium" className="text-muted-fg" content={props.fileKey}>
            {props.fileKey}
          </Typography>

          <ProgressBar value={props.value} className="w-full" />
        </div>
      </div>
    </div>
  )
}
