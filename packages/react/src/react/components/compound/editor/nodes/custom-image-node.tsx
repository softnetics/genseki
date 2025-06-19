'use client'

import React, { useEffect, useState } from 'react'

import { SpinnerIcon } from '@phosphor-icons/react'
import type { Node } from '@tiptap/core'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'

import type { StorageAdapterClient } from '../../../../../core'
import { cn } from '../../../../utils/cn'
import { BaseIcon } from '../../../primitives'
import type { CustomImageOptions } from '../extensions'

interface CustomImageNodeProps extends NodeViewProps {
  extension: Node<CustomImageOptions>
}

export const CustomImageNode: React.FC<CustomImageNodeProps> = (props) => {
  const dataKey = props.node.attrs['data-key']

  const storageAdapter = props.extension.options.storageAdapter

  if (!storageAdapter) throw new Error('Storage adapter need to pass at the extension config')

  if (!dataKey) {
    return (
      <NodeViewWrapper className="custom-image-node">
        <div className="custom-image-error">No data-key provided</div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper className="custom-image-node">
      <CustomImage
        dataKey={dataKey}
        alt={props.node.attrs.alt}
        title={props.node.attrs.title}
        className="custom-image"
        storageAdapter={storageAdapter}
      />
    </NodeViewWrapper>
  )
}

export const CustomImageNodeWithRenderer = ReactNodeViewRenderer(CustomImageNode)

interface CustomImageProps {
  alt?: string
  title?: string
  className?: string
  dataKey: string
  storageAdapter: StorageAdapterClient
}

export const CustomImage: React.FC<CustomImageProps> = ({
  dataKey,
  alt,
  title,
  className,
  storageAdapter,
}) => {
  const [src, setSrc] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        setLoading(true)
        setError(null)

        const getObjSignedUrlApiRoute = storageAdapter.grabGetObjectSignedUrlApiRoute
        const grabGetObjUrlEndpoint = new URL(getObjSignedUrlApiRoute.path, window.location.origin)
        grabGetObjUrlEndpoint.searchParams.append('key', dataKey)

        const getObjSignedUrl = await fetch(grabGetObjUrlEndpoint.toString())
        const getObjSignedUrlData = await getObjSignedUrl.json()

        if (getObjSignedUrlData.signedUrl) {
          setSrc(getObjSignedUrlData.signedUrl)
        } else {
          throw new Error('Failed to get signed URL')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch image')
      } finally {
        setLoading(false)
      }
    }

    fetchSignedUrl()
  }, [dataKey])

  if (loading) {
    return (
      <div className={cn('custom-image-loading', className)}>
        <div className="custom-image-loading-spinner">
          <BaseIcon icon={SpinnerIcon} size="lg" className="loading-spinner-icon" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('custom-image-error', className)}>
        <div className="custom-image-error-text">Failed to load image: {error}</div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      title={title}
      className={cn('custom-image-loaded', className)}
      data-key={dataKey}
    />
  )
}
