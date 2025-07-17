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
import {
  BaseIcon,
  Button,
  Description,
  Label,
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Typography,
} from '../primitives'
import { CustomFieldError } from '../primitives/custom-field-error'
import { DropZone } from '../primitives/drop-zone'

/**
 * @description Generates a signed URL for uploading a file to object storage by making a request to the provided path with the file key
 */
const generatePutObjSignedUrlData = async (
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
 * @description
 */
const uploadObject = async (
  signedUrl: string,
  file: File
): Promise<{ ok: true } | { ok: false; message: string }> => {
  try {
    await fetch(signedUrl, {
      method: 'PUT',
      body: file,
    })

    return { ok: true }
  } catch (error) {
    const message = (error as Error).message

    return { ok: false, message }
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
}

export interface FileUploadFieldProps extends DropZoneProps {
  value?: string
  name?: string
  label?: string
  placeholder?: string
  description?: string
  isRequired?: boolean
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
  const storageAdapter = useStorageAdapter()
  const inputRef = useRef<HTMLInputElement>(null)
  const maxSize = props.uploadOptions?.maxSize || 1024 * 1024 * 1
  const readableMaxSize = `${maxSize / 1024 / 1024}MB`
  const limit = props.uploadOptions?.limit || 1
  const mimeTypes = props.uploadOptions?.mimeTypes || []
  const readableMimeTypes = mimeTypes.map((mimeType) => mimeType.split('/')[1]).join(', ')

  const handleUpload = async (files: File[]) => {
    // Custom handle on your own
    setUploadStatus('pending')

    if (props.onUpload) {
      props.onUpload(files, setFileKey)
      return
    }

    // Check for storage adapter availability
    if (!storageAdapter) {
      toast.error('Storage adater is missing', {
        description: 'Check the config file if you have provided the adapter',
      })
      props.onUploadFail?.('Storage adater is missing')
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
          `File type is not alloed, only ${readableMimeTypes} ${mimeTypes.length > 1 ? 'are' : 'is'} allowed`,
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

    const key = `${crypto.randomUUID()}-${targetFile.name}`

    // Get signed URL
    const putObjSignedUrl = await generatePutObjSignedUrlData(
      storageAdapter.grabPutObjectSignedUrlApiRoute.path,
      key
    )

    if (!putObjSignedUrl.ok) {
      props.onUploadFail?.(putObjSignedUrl.message || 'generating put object signed URL error')
      toast.error('generating put object signed URL error', {
        description: putObjSignedUrl.message,
      })
      setUploadStatus('failed')
      return
    }

    // Upload file using signed URL
    const uploadResult = await uploadObject(putObjSignedUrl.data.signedUrl, targetFile)

    if (!uploadResult.ok) {
      props.onUploadFail?.(uploadResult.message || 'File upload error')
      toast.error('File upload error', {
        description: uploadResult.message,
      })
      setUploadStatus('failed')
      return
    }

    setFileKey(key)
    props.onUploadSuccess?.(key)
    setUploadStatus('success')
  }

  // For upload via clicking
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleChange', e)
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
        <Label htmlFor={props.name}>
          {props.label} {props.isRequired && <span className="ml-1 text-pumpkin-500">*</span>}
        </Label>
      )}
      {fileKey ? (
        <FileDisplayer
          uploadStatus={uploadStatus}
          fileKey={fileKey}
          onRemove={props.onRemove}
          onRemoveSuccess={props.onRemoveSuccess}
          onRemoveFail={props.onRemoveFail}
          resetFileKey={() => setFileKey(undefined)}
        />
      ) : (
        <div>
          <DropZone
            onDrop={handleDrop}
            isDisabled={props.isDisabled}
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
                  <span>
                    {readableMimeTypes} (max. {readableMaxSize})
                  </span>
                </Typography>

                {/* <Typography type="caption" weight="normal" className="text-text-trivial">
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
          />
        </div>
      )}
      {props.description && <Description>{props.description}</Description>}
      <CustomFieldError errorMessage={props.errorMessage} />
    </div>
  )
}

const FileDisplayer = (props: {
  fileKey: string
  uploadStatus?: 'pending' | 'success' | 'failed'
  resetFileKey: () => void
  onRemove?: (fileKey: string) => void
  onRemoveSuccess?: (fileKey: string) => void
  onRemoveFail?: (reason: string) => void
}) => {
  // checking by fileKey is end with format type
  const isImage =
    props.fileKey.endsWith('.webp') ||
    props.fileKey.endsWith('.png') ||
    props.fileKey.endsWith('.jpg') ||
    props.fileKey.endsWith('.jpeg') ||
    props.fileKey.endsWith('.gif')

  const handleRemove = () => {
    // Custom handle on your own
    if (props.onRemove) {
      props.onRemove(props.fileKey)
      return
    }

    try {
      // TODO: implement remove by signed-url method
      // 1. Grab delete object signed url
      // 2. Fetch the delete object signed url
      // 3. Delete the object
      props.resetFileKey()
      props.onRemoveSuccess?.(props.fileKey)
    } catch (error) {
      const message = (error as Error).message
      props.onRemoveFail?.(message || 'Remove file fail')
      toast.error('Remove file fail', { description: message })
      return
    }
  }

  const uploadStatusVariant = {
    pending: {
      icon: <BaseIcon icon={CloudArrowUpIcon} size="sm" className="text-bluegray-400" />,
      text: (
        <Typography type="body" weight="medium" className="text-bluegray-400 text-sm">
          Pending
        </Typography>
      ),
    },
    success: {
      icon: <BaseIcon icon={CheckCircleIcon} size="sm" className="text-palm-600" />,
      text: (
        <Typography type="body" weight="medium" className="text-bluegray-800 text-sm">
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

  return (
    <div className="w-full h-full bg-white rounded-md p-8 items-center gap-x-4">
      <div className="flex gap-x-4 items-start">
        {isImage && process.env.AWS_BUCKET_NAME ? (
          <div className="size-20 rounded-md overflow-hidden bg-muted border border-bluegray-300">
            <img
              // I'm not sure this is the correct way to put the bucket url in the image src
              src={`${process.env.AWS_BUCKET_NAME}/${props.fileKey}`}
              alt={props.fileKey}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <BaseIcon icon={FileIcon} size="xl" />
        )}
        <div className="flex flex-col gap-4">
          <Typography
            type="body"
            weight="medium"
            className="text-text-nontrivial"
            content={props.fileKey}
          >
            {props.fileKey}
          </Typography>

          {props.uploadStatus && (
            <div className="flex gap-2 items-center">
              {uploadStatusVariant[props.uploadStatus].icon}
              {uploadStatusVariant[props.uploadStatus].text}
            </div>
          )}

          <div className="flex gap-6 items-center">
            <Modal>
              <Button variant="destruction" size="xs">
                Remove
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
                  <ModalClose variant="destruction" size="sm" onClick={handleRemove}>
                    Delete
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
