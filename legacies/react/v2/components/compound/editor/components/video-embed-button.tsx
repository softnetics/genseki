'use client'

import { VideoIcon } from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { ToolbarItem } from '../../../../../src/react/components/primitives/toolbar'

/**
 * Drops an in-editor URL panel, mirroring how UploadImageButton drops a
 * dropzone rather than opening a browser dialog.
 */
export const VideoEmbedButton = () => {
  const { editor } = useCurrentEditor()

  if (!editor) return null

  return (
    <ToolbarItem
      type="button"
      size="md"
      variant="default"
      className="duration-150 ease-out transition-all h-18"
      onClick={() => editor.chain().focus().setVideoEmbedInputNode().run()}
      aria-label="Embed Video"
    >
      <VideoIcon weight="regular" />
    </ToolbarItem>
  )
}
