'use client'

import type { ReactNode } from 'react'
import React from 'react'
import type { DropEvent, DropzoneOptions, DropzoneState, FileRejection } from 'react-dropzone'
import { useDropzone as useReactDropzone } from 'react-dropzone'

import { PaperclipIcon } from '@phosphor-icons/react'

import { Button } from './button'
import { Typography } from './typography'

import { createRequiredContext } from '../../../src/react/hooks/create-required-context'
import { cn } from '../../../src/react/utils/cn'
declare namespace Intl {
  type ListType = 'conjunction' | 'disjunction'

  interface ListFormatOptions {
    localeMatcher?: 'lookup' | 'best fit'
    type?: ListType
    style?: 'long' | 'short' | 'narrow'
  }

  interface ListFormatPart {
    type: 'element' | 'literal'
    value: string
  }

  class ListFormat {
    constructor(locales?: string | string[], options?: ListFormatOptions)
    format(values: any[]): string
    formatToParts(values: any[]): ListFormatPart[]
    supportedLocalesOf(locales: string | string[], options?: ListFormatOptions): string[]
  }
}

interface DropzoneContextType extends DropzoneState {
  src?: File[]
  previews: { type: string; url: string }[]
  accept?: DropzoneOptions['accept']
  maxSize?: DropzoneOptions['maxSize']
  minSize?: DropzoneOptions['minSize']
  maxFiles?: DropzoneOptions['maxFiles']
}

interface FinalDropzoneContextType extends DropzoneContextType {
  caption: string
}

const renderBytes = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)}${units[unitIndex]}`
}

export const [_DropzoneProvider, useDropZone] = createRequiredContext<
  DropzoneContextType,
  FinalDropzoneContextType
>('Dropzone context', {
  valueMapper(value) {
    let caption = ''

    if (value.accept) {
      caption += 'Accepts '
      caption += new Intl.ListFormat('en').format(Object.keys(value.accept))
    }

    if (value.minSize && value.maxSize) {
      caption += ` between ${renderBytes(value.minSize)} and ${renderBytes(value.maxSize)}`
    } else if (value.minSize) {
      caption += ` at least ${renderBytes(value.minSize)}`
    } else if (value.maxSize) {
      caption += ` less than ${renderBytes(value.maxSize)}`
    }

    return { ...value, caption }
  },
})

export interface DropzoneProps extends Omit<DropzoneOptions, 'onDrop'> {
  id?: string
  src: File[]
  previews: { type: string; url: string }[]
  className?: string
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => void
  children?: ReactNode
}

/**
 * @description Dropzone provider, children under this component can use `useDropZone`
 * @default maxSize is 20MB
 */
export const DropzoneProvider = ({
  src,
  accept,
  maxSize,
  minSize,
  maxFiles = 1,
  previews = [],
  onDrop,
  onError,
  disabled,
  children,
  ...props
}: DropzoneProps) => {
  const dropzoneCtx = useReactDropzone({
    accept,
    maxFiles,
    maxSize: maxSize ?? 1024 * 1024 * 20, // 20MB
    minSize,
    onError,
    disabled,
    onDrop: (acceptedFiles, fileRejections, event) => {
      if (fileRejections.length > 0) {
        const message = fileRejections.at(0)?.errors.at(0)?.message
        onError?.(new Error(message))
        return
      }

      onDrop?.(acceptedFiles, fileRejections, event)
    },
    ...props,
  })

  return (
    <_DropzoneProvider
      src={src}
      previews={previews}
      accept={accept}
      maxSize={maxSize}
      minSize={minSize}
      maxFiles={maxFiles}
      {...dropzoneCtx}
    >
      {children}
    </_DropzoneProvider>
  )
}

/**
 * @description render if no previewable item
 */
export const DropZoneNonemptyContent = (props: { children?: React.ReactNode }) => {
  const dropzoneCtx = useDropZone()

  if (dropzoneCtx.previews.length === 0) return null

  return props.children
}

/**
 * @description render if has a previewable item
 */
export const DropZoneEmptyContent = (props: { children?: React.ReactNode }) => {
  const dropzoneCtx = useDropZone()

  if (dropzoneCtx.previews.length > 0) return null

  return props.children
}

export const DropZoneArea = (props: React.ComponentPropsWithRef<'button'>) => {
  const dropzoneCtx = useDropZone()

  return (
    <div
      data-drag-active={dropzoneCtx.isDragActive}
      data-drag-accept={dropzoneCtx.isDragAccept}
      data-drag-reject={dropzoneCtx.isDragReject}
      data-focused={dropzoneCtx.isFocused}
      data-file-dialog-active={dropzoneCtx.isFileDialogActive}
      className={cn(
        'group/dropzone relative h-auto w-full flex-col overflow-hidden rounded-md border border-dashed p-12',
        'data-[drag-active=true]:ring-ring ring-offset-2 data-[drag-active=true]:outline-none data-[drag-active=true]:ring-[2px]',
        'disabled:bg-surface-primary-disabled',
        props.className
      )}
      {...dropzoneCtx.getRootProps({
        style: {
          border: '2px dashed var(--color-border)',
        },
      })}
    >
      <input
        {...dropzoneCtx.getInputProps()}
        disabled={props.disabled}
        aria-disabled={props.disabled}
        id={props.id}
      />
      {props.children}
    </div>
  )
}

export type DropzoneContentProps = {
  children?: ReactNode
  className?: string
}

// /**
//  * @description `DropzoneContent` displays content after user upload media,
//  * you can pass a children as a custom renderer and empower with `useDropZone`
//  * hook to access underlying uploaded items data
//  */
// export const DropzoneContent = ({ children, className }: DropzoneContentProps) => {
//   const { previews } = useDropZone()

//   if (previews.length === 0) return null

//   if (children) return children

//   return (
//     <div className={cn('flex flex-col items-center justify-center', className)}>
//       {previews?.map(({ type, url }) => (
//         <Fragment key={url}>
//           {type.startsWith('image/') ? (
//             <img src={url} key={url} onLoad={() => URL.revokeObjectURL(url)} />
//           ) : type.startsWith('video/') ? (
//             <video controls width="640" height="480" autoPlay>
//               <source src={url} key={url} type={type} onLoad={() => URL.revokeObjectURL(url)} />
//             </video>
//           ) : type.startsWith('audio/') ? (
//             <audio controls>
//               <source src={url} key={url} type={type} onLoad={() => URL.revokeObjectURL(url)} />
//             </audio>
//           ) : (
//             <Typography className="text-text-secondary">Unsupported file type</Typography>
//           )}
//         </Fragment>
//       ))}
//     </div>
//   )
// }

export type DropzoneEmptyStateProps = {
  children?: ReactNode
  className?: string
}

export const DropZoneEmptyUploadButton = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Button>) => {
  const { maxFiles } = useDropZone()

  return (
    <Button
      variant="outline"
      asChild
      children={
        <button
          className={cn(
            'group-disabled/dropzone:bg-surface-primary-disabled group-disabled/dropzone:active:bg-surface-primary-disabled group-disabled/dropzone:cursor-default',
            className
          )}
        >
          <PaperclipIcon />
          <span>Upload {maxFiles === 1 ? 'a file' : 'files'}</span>
        </button>
      }
      {...props}
    />
  )
}

export const DropZoneEmptyUploadDescription = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Typography>) => {
  return (
    <Typography
      weight="medium"
      className={cn('min-w-[270px] text-text-tertiary', className)}
      children={
        <>
          <span className="text-text-info">Click to upload</span> or drag and drop PNG, JPG, GIF
          (max. 2MB)
        </>
      }
      {...props}
    />
  )
}

export const DropZoneEmptyUploadCaption = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Typography>) => {
  const { caption } = useDropZone()

  if (!caption) return null

  return (
    <Typography type="caption" className={cn('text-secondary-fg', className)} {...props}>
      {caption}.
    </Typography>
  )
}
