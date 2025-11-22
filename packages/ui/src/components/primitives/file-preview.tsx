'use client'

import type React from 'react'
import { useMemo } from 'react'

import {
  CheckCircleIcon,
  CircleDashedIcon,
  CloudArrowUpIcon,
  FileIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { Slot } from '@radix-ui/react-slot'

import { Typography } from './typography'

import { cn } from '../../utils/cn'

function FilePreview(props: { children?: React.ReactNode }) {
  return (
    <div className="p-8 rounded-xl border border-border bg-background flex gap-4">
      {props.children}
    </div>
  )
}

function FilePreviewThumbnail(props: { children?: React.ReactNode; className?: string }) {
  if (!props.children)
    return (
      <div className="size-20" data-slot="file-preview-thumbnail">
        <FileIcon className="text-icon-tertiary size-full" />
      </div>
    )

  return (
    <div
      className={cn('size-40 rounded-md border bg-background overflow-clip', props.className)}
      data-slot="file-preview-thumbnail"
    >
      {props.children}
    </div>
  )
}

function FilePreviewContent({
  asChild,
  className,
  ...props
}: React.ComponentPropsWithRef<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      className={cn('flex flex-col gap-y-4', className)}
      data-slot="file-preview-content"
      {...props}
    />
  )
}

function FilePreviewTitle(props: { children?: React.ReactNode }) {
  return (
    <Typography weight="medium" data-slot="file-preview-title">
      {props.children}
    </Typography>
  )
}

function FilePreviewStatus({
  status,
  className,
  classNames,
  ...props
}: {
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  className?: string
  classNames?: {
    icon?: string
    text?: string
  }
} & React.ComponentPropsWithRef<'div'>) {
  const content = useMemo(() => {
    if (status === 'PENDING') {
      return (
        <>
          <CloudArrowUpIcon
            weight="fill"
            className={cn('text-icon-tertiary size-8', classNames?.icon)}
          />
          <Typography
            type="label"
            weight="medium"
            className={cn('text-text-tertiary', classNames?.text)}
          >
            Pending
          </Typography>
        </>
      )
    }

    if (status === 'COMPLETED') {
      return (
        <>
          <CheckCircleIcon
            weight="fill"
            className={cn('text-icon-correct size-8', classNames?.icon)}
          />
          <Typography
            type="label"
            weight="medium"
            className={cn('leading-[85%] text-text-primary', classNames?.text)}
          >
            Completed
          </Typography>
        </>
      )
    }

    if (status === 'FAILED') {
      return (
        <>
          <XCircleIcon
            weight="fill"
            className={cn('text-icon-incorrect size-8', classNames?.icon)}
          />
          <Typography
            type="label"
            weight="medium"
            className={cn('leading-[85%] text-text-incorrect', classNames?.text)}
          >
            Failed
          </Typography>
        </>
      )
    }

    return (
      <>
        <CircleDashedIcon className={cn('text-icon-tertiary size-8', classNames?.icon)} />
        <Typography
          type="label"
          weight="medium"
          className={cn('leading-[85%] text-text-tertiary', classNames?.text)}
        >
          Failed
        </Typography>
      </>
    )
  }, [classNames?.icon, classNames?.text])

  return (
    <div
      className={cn('flex gap-x-2 items-center', className)}
      data-slot="file-preview-status"
      {...props}
    >
      {content}
    </div>
  )
}

function FilePreviewAddons(props: { className?: string; children?: React.ReactNode }) {
  return <div className={cn('flex gap-x-6', props.className)}>{props.children}</div>
}

export {
  FilePreview,
  FilePreviewAddons,
  FilePreviewContent,
  FilePreviewStatus,
  FilePreviewThumbnail,
  FilePreviewTitle,
}
