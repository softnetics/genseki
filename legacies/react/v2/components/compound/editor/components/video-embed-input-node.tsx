'use client'

import * as React from 'react'

import { VideoIcon } from '@phosphor-icons/react'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'

import {
  validateVideoEmbedUrl,
  VIDEO_EMBED_REJECTION_MESSAGE,
} from '../extensions/video-embed-extension'

export const VideoEmbedInputNode: React.FC<NodeViewProps> = (props) => {
  const [url, setUrl] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  const remove = () => {
    const pos = props.getPos()
    props.editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + 1 })
      .run()
  }

  const submit = () => {
    const value = url.trim()

    const rejection = validateVideoEmbedUrl(value)
    if (rejection) {
      setError(VIDEO_EMBED_REJECTION_MESSAGE[rejection])
      return
    }

    // Replace this placeholder with the real embed
    const pos = props.getPos()
    props.editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + 1 })
      .insertContentAt(pos, [{ type: 'videoEmbed', attrs: { src: value } }])
      .run()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      submit()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      remove()
    }
  }

  return (
    <NodeViewWrapper className="tiptap-video-embed-input" tabIndex={0}>
      <div className="tiptap-video-embed-input-icon">
        <VideoIcon className="text-[2rem]" />
      </div>

      <div className="tiptap-video-embed-input-content">
        <span className="tiptap-video-embed-input-text">Paste a video link</span>
        <input
          autoFocus
          type="url"
          inputMode="url"
          placeholder="https://"
          value={url}
          className="tiptap-video-embed-input-field"
          onChange={(event) => {
            setUrl(event.target.value)
            setError(null)
          }}
          onKeyDown={onKeyDown}
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
        />

        {error && <span className="tiptap-video-embed-input-error">{error}</span>}

        <div className="tiptap-video-embed-input-actions">
          <button type="button" onClick={remove} className="tiptap-video-embed-input-cancel">
            Cancel
          </button>
          <button type="button" onClick={submit} className="tiptap-video-embed-input-submit">
            Embed
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export const VideoEmbedInputNodeWithRenderer = ReactNodeViewRenderer(VideoEmbedInputNode)
