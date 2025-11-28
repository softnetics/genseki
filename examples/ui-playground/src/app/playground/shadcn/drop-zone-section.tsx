import React, { Fragment, useState } from 'react'

import { XIcon } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'

import {
  Button,
  DropZoneArea,
  DropZoneEmptyContent,
  DropZoneEmptyUploadButton,
  DropZoneEmptyUploadCaption,
  DropZoneEmptyUploadDescription,
  DropZoneNonemptyContent,
  FilePreview,
  FilePreviewAddons,
  FilePreviewContent,
  FilePreviewStatus,
  FilePreviewThumbnail,
  FilePreviewTitle,
  Typography,
  useDropZone,
} from '@genseki/ui'
import { DropzoneProvider } from '@genseki/ui'

import { InformationCard, PlaygroundCard } from '~/src/components/card'

function FilePreviewItem(props: { index: number; removePreview: (index?: number) => void }) {
  const dropzoneCtx = useDropZone()

  return (
    <FilePreview>
      <FilePreviewThumbnail />
      {/*
       * You can pass a preview as a children of FilePreviewThumbnail
       * <FilePreviewThumbnail className="size-50">
       *   <img src="..." alt="..." />
       * </FilePreviewThumbnail>
       */}
      <FilePreviewContent>
        <FilePreviewTitle>{dropzoneCtx.src?.[props.index].name}</FilePreviewTitle>
        <FilePreviewStatus status="COMPLETED" />
        <FilePreviewAddons>
          <DropZoneArea className="hidden" aria-hidden />
          <button
            onClick={() => {
              dropzoneCtx.inputRef.current.click()
            }}
            className="px-4 py-2 rounded-sm bg-surface-primary-hover text-text-secondary cursor-pointer"
          >
            <Typography type="caption" weight="medium">
              Change
            </Typography>
          </button>

          <button
            onClick={() => props.removePreview(props.index)}
            className="px-4 py-2 rounded-sm bg-surface-incorrect text-text-incorrect-bold cursor-pointer"
          >
            <Typography type="caption" weight="medium">
              Remove
            </Typography>
          </button>
        </FilePreviewAddons>
      </FilePreviewContent>
    </FilePreview>
  )
}

function CustomDropzoneContent(props: {
  children?: React.ReactNode
  removePreview: (number?: number) => void
}) {
  const fullPreview = false // Try change this flag
  const dropzoneCtx = useDropZone()
  const router = useRouter()

  const isValidPreview = dropzoneCtx.previews.every((preview) => {
    return (
      preview.type.startsWith('image/') ||
      preview.type.startsWith('video/') ||
      preview.type.startsWith('audio/')
    )
  })

  if (!isValidPreview) {
    return (
      <DropZoneArea>
        <div className="flex flex-col items-center justify-center gap-y-6">
          <DropZoneEmptyUploadButton />
          <DropZoneEmptyUploadDescription />
          <DropZoneEmptyUploadCaption />
          <Typography className="text-destructive">Unsupported file type</Typography>
        </div>
      </DropZoneArea>
    )
  }

  if (isValidPreview && !fullPreview) {
    return (
      // Handle more customization by yourselves here
      props.children
    )
  }

  // This is an another preview example
  return (
    <div className="relative flex flex-col gap-y-6 border p-6 rounded-md">
      <Button
        variant="destructive"
        size="sm"
        className="z-10 shadow-xl sticky w-fit ml-auto mr-4 top-4 right-4"
        onClick={() => {
          props.removePreview()
          router.replace('#drop-zone', { scroll: true })
        }}
      >
        <XIcon />
        Remove
      </Button>
      {dropzoneCtx.previews?.map(({ type, url }) => (
        <div key={url}>
          {type.startsWith('image/') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt="image"
              key={url}
              onLoad={() => URL.revokeObjectURL(url)}
              className="rounded-md"
            />
          ) : type.startsWith('video/') ? (
            <video controls width="640" height="480" autoPlay>
              <source src={url} key={url} type={type} onLoad={() => URL.revokeObjectURL(url)} />
            </video>
          ) : type.startsWith('audio/') ? (
            <audio controls>
              <source src={url} key={url} type={type} onLoad={() => URL.revokeObjectURL(url)} />
            </audio>
          ) : null}
        </div>
      ))}
    </div>
  )
}

// Custom Dropzone
function CustomDropzone() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<{ type: string; url: string }[]>([])

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    const newPreviews = acceptedFiles.map((file) => ({
      type: file.type,
      url: URL.createObjectURL(file),
    }))
    setPreviews(newPreviews)
  }

  const handleError = (error: Error) => {
    console.log(error)
  }

  const removePreview = (imageId?: number) => {
    // You can use imageId or something to filter the remove preview
    setFiles([])
    setPreviews([])
  }

  return (
    <DropzoneProvider
      src={files}
      previews={previews}
      onError={handleError}
      onDrop={handleDrop}
      className="min-h-32"
      maxFiles={5}
    >
      <DropZoneEmptyContent>
        <DropZoneArea>
          {/* These content will be displayed if no previewable item */}
          <div className="flex flex-col items-center justify-center gap-y-6">
            <DropZoneEmptyUploadButton />
            <DropZoneEmptyUploadDescription />
            <DropZoneEmptyUploadCaption />
          </div>
        </DropZoneArea>
      </DropZoneEmptyContent>
      <DropZoneNonemptyContent>
        {/* These content will be displayed if there're available previewable item */}
        <CustomDropzoneContent removePreview={removePreview}>
          <div className="flex flex-col gap-y-4">
            {previews.map((preview, index) => (
              <FilePreviewItem key={preview.url} index={index} removePreview={removePreview} />
            ))}
          </div>
        </CustomDropzoneContent>
      </DropZoneNonemptyContent>
    </DropzoneProvider>
  )
}

function CustomDropzoneWithFileReplcaeContent(props: { removePreview: () => void }) {
  const { previews, isDragActive } = useDropZone()

  return (
    <DropZoneArea>
      <div className="relative grid grid-cols-3 gap-6 border p-6 rounded-md">
        {previews?.map(({ type, url }) => (
          <div
            key={url}
            className="bg-secondary my-auto rotate-0 rounded-md"
            style={{
              rotate: `${isDragActive ? Math.random() * 12 * (Math.random() > 0.5 ? 1 : -1) : 0}deg`,
              transition: 'all 0.25s ease-out',
              boxShadow: `0px 2px ${isDragActive ? 10 : 0}px -2px #595959`,
            }}
          >
            {type.startsWith('image/') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="image" key={url} onLoad={() => URL.revokeObjectURL(url)} />
            ) : type.startsWith('video/') ? (
              <video controls width="640" height="480" autoPlay>
                <source src={url} key={url} type={type} onLoad={() => URL.revokeObjectURL(url)} />
              </video>
            ) : type.startsWith('audio/') ? (
              <audio controls>
                <source src={url} key={url} type={type} onLoad={() => URL.revokeObjectURL(url)} />
              </audio>
            ) : null}
          </div>
        ))}
      </div>
    </DropZoneArea>
  )
}

// Custom Dropzone with file replace
function CustomDropzoneWithFileReplace() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<{ type: string; url: string }[]>([])

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    const newPreviews = acceptedFiles.map((file) => ({
      type: file.type,
      url: URL.createObjectURL(file),
    }))
    setPreviews(newPreviews)
  }

  const handleError = (error: Error) => {
    console.log(error)
  }

  const removePreview = () => {
    setFiles([])
    setPreviews([])
  }

  return (
    <DropzoneProvider
      src={files}
      previews={previews}
      onError={handleError}
      onDrop={handleDrop}
      className="min-h-32"
      maxFiles={Infinity}
    >
      <DropZoneEmptyContent>
        <DropZoneArea>
          {/* These content will be displayed if no previewable item */}
          <div className="flex flex-col items-center justify-center gap-y-6">
            <DropZoneEmptyUploadButton />
            <DropZoneEmptyUploadDescription />
            <DropZoneEmptyUploadCaption />
          </div>
        </DropZoneArea>
      </DropZoneEmptyContent>
      <DropZoneNonemptyContent>
        <CustomDropzoneWithFileReplcaeContent removePreview={removePreview} />
      </DropZoneNonemptyContent>
    </DropzoneProvider>
  )
}

// Dropzone with Image Preview
function DropzoneWithImagePreview() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<{ type: string; url: string }[]>([])

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    const newPreviews = acceptedFiles.map((file) => ({
      type: file.type,
      url: URL.createObjectURL(file),
    }))
    setPreviews(newPreviews)
  }

  const handleError = (error: Error) => {
    console.error(error)
  }

  const removePreview = () => {
    setFiles([])
    setPreviews([])
  }

  return (
    <DropzoneProvider
      src={files}
      previews={previews}
      onError={handleError}
      onDrop={handleDrop}
      accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
      maxFiles={1}
    >
      <DropZoneEmptyContent>
        <DropZoneArea className="min-h-48">
          <div className="flex flex-col items-center justify-center gap-y-4">
            <DropZoneEmptyUploadButton />
            <DropZoneEmptyUploadDescription />
            <DropZoneEmptyUploadCaption />
          </div>
        </DropZoneArea>
      </DropZoneEmptyContent>
      <DropZoneNonemptyContent>
        <div className="grid grid-cols-1 gap-4">
          {previews.map((preview) => (
            <div key={preview.url} className="relative group">
              {preview.type.startsWith('image/') && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.url}
                  alt="Uploaded"
                  className="w-full h-auto object-cover rounded-md"
                  onLoad={() => URL.revokeObjectURL(preview.url)}
                />
              )}
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={removePreview}
              >
                <XIcon />
                Remove
              </Button>
            </div>
          ))}
        </div>
      </DropZoneNonemptyContent>
    </DropzoneProvider>
  )
}

// Multiple File Dropzone
function MultipleFileDropzone() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<{ type: string; url: string }[]>([])

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    const newPreviews = acceptedFiles.map((file) => ({
      type: file.type,
      url: URL.createObjectURL(file),
    }))
    setPreviews(newPreviews)
  }

  const handleError = (error: Error) => {
    console.error(error)
  }

  const removePreview = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  return (
    <DropzoneProvider
      src={files}
      previews={previews}
      onError={handleError}
      onDrop={handleDrop}
      maxFiles={5}
    >
      <DropZoneEmptyContent>
        <DropZoneArea className="min-h-32">
          <div className="flex flex-col items-center justify-center gap-y-6">
            <DropZoneEmptyUploadButton />
            <DropZoneEmptyUploadDescription />
            <DropZoneEmptyUploadCaption />
          </div>
        </DropZoneArea>
      </DropZoneEmptyContent>
      <DropZoneNonemptyContent>
        <div className="grid grid-cols-2 gap-4">
          {previews.map((preview, index) => (
            <div key={preview.url} className="relative group">
              <FilePreview>
                <FilePreviewThumbnail />
                <FilePreviewContent>
                  <FilePreviewTitle>{files[index]?.name || `File ${index + 1}`}</FilePreviewTitle>
                  <FilePreviewStatus status="COMPLETED" />
                  <FilePreviewAddons>
                    <button
                      onClick={() => removePreview(index)}
                      className="px-4 py-2 rounded-sm bg-surface-incorrect text-text-incorrect-bold cursor-pointer"
                    >
                      <Typography type="caption" weight="medium">
                        Remove
                      </Typography>
                    </button>
                  </FilePreviewAddons>
                </FilePreviewContent>
              </FilePreview>
            </div>
          ))}
        </div>
      </DropZoneNonemptyContent>
    </DropzoneProvider>
  )
}

// Dropzone with File Size Validation
function DropzoneWithValidation() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<{ type: string; url: string }[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    setError(null)
    const newPreviews = acceptedFiles.map((file) => ({
      type: file.type,
      url: URL.createObjectURL(file),
    }))
    setPreviews(newPreviews)
  }

  const handleError = (error: Error) => {
    setError(error.message)
  }

  const removePreview = () => {
    setFiles([])
    setPreviews([])
    setError(null)
  }

  return (
    <DropzoneProvider
      src={files}
      previews={previews}
      onError={handleError}
      onDrop={handleDrop}
      maxSize={2 * 1024 * 1024} // 2MB
      maxFiles={1}
    >
      <DropZoneEmptyContent>
        <DropZoneArea className="min-h-32">
          <div className="flex flex-col items-center justify-center gap-y-6">
            <DropZoneEmptyUploadButton />
            <DropZoneEmptyUploadDescription />
            <DropZoneEmptyUploadCaption />
            {error && <Typography className="text-destructive">{error}</Typography>}
          </div>
        </DropZoneArea>
      </DropZoneEmptyContent>
      <DropZoneNonemptyContent>
        <div className="flex flex-col gap-4">
          {previews.map((preview, index) => (
            <FilePreview key={preview.url}>
              <FilePreviewThumbnail />
              <FilePreviewContent>
                <FilePreviewTitle>{files[index]?.name || 'Uploaded file'}</FilePreviewTitle>
                <FilePreviewStatus status="COMPLETED" />
                <FilePreviewAddons>
                  <button
                    onClick={removePreview}
                    className="px-4 py-2 rounded-sm bg-surface-incorrect text-text-incorrect-bold cursor-pointer"
                  >
                    <Typography type="caption" weight="medium">
                      Remove
                    </Typography>
                  </button>
                </FilePreviewAddons>
              </FilePreviewContent>
            </FilePreview>
          ))}
        </div>
      </DropZoneNonemptyContent>
    </DropzoneProvider>
  )
}

export function DropZoneSection() {
  return (
    <>
      <div className="grid gap-8">
        <InformationCard>
          You can use the
          <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
            useDropZone
          </span>{' '}
          under the{' '}
          <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
            {'<DropzoneProvider />'}
          </span>{' '}
          component to manage the file
        </InformationCard>
        <PlaygroundCard title="Custom Dropzone" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A basic dropzone for file uploads with drag and drop functionality.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <CustomDropzone />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Custom Dropzone with replacable preview" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A basic replacable preview dropzone for file uploads with drag and drop functionality.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <CustomDropzoneWithFileReplace />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Dropzone with Image Preview" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Dropzone that accepts only image files and displays a preview with hover effects.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <DropzoneWithImagePreview />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Multiple File Dropzone" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Dropzone that allows uploading multiple files at once with individual file management.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <MultipleFileDropzone />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Dropzone with File Size Validation" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Dropzone with file size validation showing error messages for oversized files.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <DropzoneWithValidation />
          </div>
        </PlaygroundCard>
      </div>
    </>
  )
}
