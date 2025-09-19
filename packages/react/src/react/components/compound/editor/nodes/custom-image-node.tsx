'use client'

import React, { useEffect, useState } from 'react'

import { SpinnerIcon } from '@phosphor-icons/react'
import type { Node } from '@tiptap/core'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { toast } from 'sonner'

import type { StorageAdapterClient } from '../../../../../core'
import { cn } from '../../../../utils/cn'
import { BaseIcon } from '../../../primitives'
import { deleteObject, generateDeleteObjSignedUrlData } from '../../file-upload-field'
import type { CustomImageOptions } from '../extensions'

interface CustomImageNodeProps extends NodeViewProps {
  extension: Node<CustomImageOptions>
}

export const CustomImageNode: React.FC<CustomImageNodeProps> = (props) => {
  const dataKey = props.node.attrs['data-key']
  const caption = props.node.attrs.caption
  const [isEditingCaption, setIsEditingCaption] = useState(false)
  const [captionText, setCaptionText] = useState(caption || '')

  const storageAdapter = props.extension.options.storageAdapter

  if (!storageAdapter) throw new Error('Storage adapter need to pass at the extension config')

  if (!dataKey) {
    return (
      <NodeViewWrapper>
        <div className="custom-image-error">No data-key provided</div>
      </NodeViewWrapper>
    )
  }

  const handleCaptionSubmit = () => {
    props.updateAttributes({ caption: captionText })
    setIsEditingCaption(false)
  }

  const handleCaptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCaptionSubmit()
    }
    if (e.key === 'Escape') {
      setCaptionText(caption || '')
      setIsEditingCaption(false)
    }
  }

  const handleCaptionClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsEditingCaption(true)
  }

  const handleDelete = async () => {
    try {
      const deleteSignedUrlPath = storageAdapter.grabDeleteObjectSignedUrlApiRoute?.path

      if (!deleteSignedUrlPath) {
        toast.error('Delete functionality not configured')
        return
      }

      const deleteObjSignedUrl = await generateDeleteObjSignedUrlData(deleteSignedUrlPath, dataKey)

      if (!deleteObjSignedUrl.ok) {
        toast.error('Failed to generate delete URL')
        console.error('Delete signed URL error:', deleteObjSignedUrl.message)
        return
      }

      const deleteResult = await deleteObject(deleteObjSignedUrl.data.body.signedUrl)

      if (!deleteResult.ok) {
        toast.error('Failed to delete from storage')
        console.error('Delete object error:', deleteResult.message)
        return
      }

      props.deleteNode()

      toast.success('Image deleted successfully')
    } catch (error) {
      console.error('Failed to delete image:', error)
      toast.error('Failed to delete image')
    }
  }

  useEffect(() => {
    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      if (props.selected && !isEditingCaption) {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault()
          e.stopPropagation()
          handleDelete()
        }
      }
    }

    document.addEventListener('keydown', handleDocumentKeyDown, true)
    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown, true)
    }
  }, [props.selected, isEditingCaption])

  return (
    <NodeViewWrapper>
      <figure className="custom-image-figure">
        <div className="custom-image-container relative">
          <CustomImage
            dataKey={dataKey}
            alt={props.node.attrs.alt}
            title={props.node.attrs.title}
            className="custom-image"
            storageAdapter={storageAdapter}
          />
        </div>

        {isEditingCaption ? (
          <div className="custom-image-caption-editor">
            <textarea
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              onBlur={handleCaptionSubmit}
              onKeyDown={handleCaptionKeyDown}
              placeholder="Enter image caption..."
              autoFocus
              className="custom-image-caption-textarea"
            />
            <div className="custom-image-caption-hint">Press Enter to save, Escape to cancel</div>
          </div>
        ) : (
          <figcaption
            onClick={handleCaptionClick}
            className={cn(
              'custom-image-caption',
              caption ? 'custom-image-caption-filled' : 'custom-image-caption-empty'
            )}
          >
            {caption || 'Click to add caption...'}
          </figcaption>
        )}
      </figure>
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
        if (getObjSignedUrlData.body.signedUrl) {
          setSrc(getObjSignedUrlData.body.signedUrl)
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
  }, [dataKey, storageAdapter])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

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
        <div className="custom-image-error-content">
          <div className="custom-image-error-title">Failed to load image</div>
          <div className="custom-image-error-message">{error}</div>
        </div>
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
