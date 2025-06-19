'use client'

import * as React from 'react'

import { CloudArrowUpIcon, FileArrowUpIcon, XIcon } from '@phosphor-icons/react'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'

import type { UploadFunction } from '../../../../../core/file-storage-adapters/generic-adapter'
import { cn } from '../../../../utils/cn'
import { BaseIcon } from '../../../primitives'

export type FileItem =
  | {
      id: string
      file: File
      progress: number
      status: 'uploading' | 'success' | 'error'
      key?: string
      abortController?: AbortController
    }
  | {
      id: string
      file: File
      status: 'uploading-no-progress'
      key?: string
      abortController?: AbortController
    }

interface UploadOptions {
  maxSize: number
  limit: number
  accept: string
  upload: UploadFunction
  onSuccess?: (result: { key: string }) => void
  onError?: (error: Error) => void
  showProgress?: boolean
}

function useFileUpload(options: UploadOptions) {
  const [fileItem, setFileItem] = React.useState<FileItem | null>(null)

  const uploadFile = async (file: File): Promise<{ key: string } | null> => {
    if (file.size > options.maxSize) {
      const error = new Error(
        `File size exceeds maximum allowed (${options.maxSize / 1024 / 1024}MB)`
      )
      options.onError?.(error)
      return null
    }

    const abortController = new AbortController()

    const newFileItem: FileItem = options.showProgress
      ? {
          id: crypto.randomUUID(),
          file,
          progress: 0,
          status: 'uploading',
          abortController,
        }
      : {
          id: crypto.randomUUID(),
          file,
          status: 'uploading-no-progress',
          abortController,
        }

    setFileItem(newFileItem)

    try {
      if (!options.upload) throw new Error('Upload function is not defined')

      const result = await options.upload(
        file,
        (event: { progress: number }) => {
          setFileItem((prev) => {
            if (!prev) return null
            return {
              ...prev,
              progress: event.progress,
            }
          })
        },
        abortController.signal
      )

      if (!result) throw new Error('Upload failed: No URL returned')

      if (!abortController.signal.aborted) {
        setFileItem((prev) => {
          if (!prev) return null
          return {
            ...prev,
            status: 'success',
            key: result.key,
            progress: 100,
          }
        })
        options.onSuccess?.({ key: result.key })
        return result
      }

      return null
    } catch (error) {
      if (!abortController.signal.aborted) {
        setFileItem((prev) => {
          if (!prev) return null
          return {
            ...prev,
            status: 'error',
            progress: 0,
          }
        })
        options.onError?.(error instanceof Error ? error : new Error('Upload failed'))
      }
      return null
    }
  }

  const uploadFiles = async (files: File[]): Promise<{ key: string } | null> => {
    if (!files || files.length === 0) {
      options.onError?.(new Error('No files to upload'))
      return null
    }

    if (options.limit && files.length > options.limit) {
      options.onError?.(
        new Error(`Maximum ${options.limit} file${options.limit === 1 ? '' : 's'} allowed`)
      )
      return null
    }

    const file = files[0]
    if (!file) {
      options.onError?.(new Error('File is undefined'))
      return null
    }

    return uploadFile(file)
  }

  const clearFileItem = () => {
    if (!fileItem) return

    if (fileItem.abortController) {
      fileItem.abortController.abort()
    }
    // if (fileItem.url) {
    //   URL.revokeObjectURL(fileItem.url)
    // }
    setFileItem(null)
  }

  return {
    fileItem,
    uploadFiles,
    clearFileItem,
  }
}

interface ImageUploadDragAreaProps {
  onFile: (files: File[]) => void
  children?: React.ReactNode
}

const ImageUploadDragArea: React.FC<ImageUploadDragAreaProps> = ({ onFile, children }) => {
  const [dragover, setDragover] = React.useState(false)

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setDragover(false)
    e.preventDefault()
    e.stopPropagation()

    const files = Array.from(e.dataTransfer.files)
    onFile(files)
  }

  const onDragover = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragover(true)
  }

  const onDragleave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragover(false)
  }

  return (
    <div
      className={`tiptap-image-upload-dragger ${dragover ? 'tiptap-image-upload-dragger-active' : ''}`}
      onDrop={onDrop}
      onDragOver={onDragover}
      onDragLeave={onDragleave}
    >
      {children}
    </div>
  )
}

type ImageUploadPreviewProps =
  | {
      file: File
      progress: number
      status: 'uploading' | 'success' | 'error'
      onRemove: () => void
    }
  | {
      file: File
      status: 'uploading-no-progress'
      onRemove: () => void
    }

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = (props) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div className="tiptap-image-upload-preview">
      <div className="tiptap-image-upload-preview-content">
        <div className="tiptap-image-upload-file-info">
          <div className="tiptap-image-upload-file-icon">
            <BaseIcon icon={CloudArrowUpIcon} size="xl" />
          </div>
          <div className="tiptap-image-upload-details">
            <span className="tiptap-image-upload-text">{props.file.name}</span>
            <span className="tiptap-image-upload-subtext">{formatFileSize(props.file.size)}</span>
          </div>
        </div>
        <div className="tiptap-image-upload-actions">
          {props.status === 'uploading' && (
            <span className="tiptap-image-upload-progress-text">{props.progress}%</span>
          )}
          {props.status === 'uploading-no-progress' && (
            <span className="tiptap-image-upload-progress-text">Uploading...</span>
          )}
          <button
            className="tiptap-image-upload-close-btn"
            onClick={(e) => {
              e.stopPropagation()
              props.onRemove()
            }}
          >
            <XIcon />
          </button>
        </div>
      </div>

      {props.status == 'uploading' && (
        <div className="tiptap-image-upload-progress" style={{ width: `${props.progress}%` }} />
      )}
    </div>
  )
}

const DropZoneContent: React.FC<{ maxSize: number }> = ({ maxSize }) => (
  <>
    <div className="tiptap-image-upload-dropzone">
      <FileArrowUpIcon className="text-[2rem]" />
    </div>

    <div className="tiptap-image-upload-content">
      <span className="tiptap-image-upload-text">
        <em>Click to upload</em> or drag and drop
      </span>
      <span className="tiptap-image-upload-subtext">
        Maximum file size {maxSize / 1024 / 1024}MB.
      </span>
    </div>
  </>
)

/**
 * @description This custom node is not meant to be used directly, instead used by the image plugin.
 */
export const ImageUploadNode: React.FC<NodeViewProps> = (props) => {
  console.log('Image upload node props:', props)
  const { accept, limit, maxSize } = props.node.attrs
  const inputRef = React.useRef<HTMLInputElement>(null)
  const extension = props.extension

  const uploadOptions: UploadOptions = {
    maxSize,
    limit,
    accept,
    upload: extension.options.upload,
    onSuccess: extension.options.onSuccess,
    onError: extension.options.onError,
    showProgress: extension.options.showProgress,
  }

  const { fileItem, uploadFiles, clearFileItem } = useFileUpload(uploadOptions)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      extension.options.onError?.(new Error('No file selected'))
      return
    }
    handleUpload(Array.from(files))
  }

  const handleUpload = async (files: File[]) => {
    const result = await uploadFiles(files)

    if (result) {
      const pos = props.getPos()
      const filename = files[0]?.name.replace(/\.[^/.]+$/, '') || 'unknown'

      props.editor
        .chain()
        .focus()
        .deleteRange({ from: pos, to: pos + 1 })
        .insertContentAt(pos, [
          {
            type: 'customImage',
            attrs: { alt: filename, title: filename, 'data-key': result.key },
          },
        ])
        .run()
    }
  }

  const handleClick = () => {
    if (inputRef.current && !fileItem) {
      inputRef.current.value = ''
      inputRef.current.click()
    }
  }

  return (
    <NodeViewWrapper
      className={cn(
        'tiptap-image-upload',
        fileItem?.status === 'error' && 'tiptap-image-upload-error'
      )}
      tabIndex={0}
      onClick={handleClick}
    >
      <div className="padder">
        {!fileItem && (
          <ImageUploadDragArea onFile={handleUpload}>
            <DropZoneContent maxSize={maxSize} />
          </ImageUploadDragArea>
        )}

        {fileItem && fileItem.status === 'uploading-no-progress' ? (
          <ImageUploadPreview
            file={fileItem.file}
            status="uploading-no-progress"
            onRemove={clearFileItem}
          />
        ) : (
          fileItem && (
            <ImageUploadPreview
              file={fileItem.file}
              progress={fileItem.progress}
              status={fileItem.status}
              onRemove={clearFileItem}
            />
          )
        )}

        <input
          ref={inputRef}
          name="file"
          accept={accept}
          type="file"
          onChange={handleChange}
          onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
        />
      </div>
    </NodeViewWrapper>
  )
}

export const ImageUploadNodeWithRenderer = ReactNodeViewRenderer(ImageUploadNode)
