'use client'
import { ImageIcon } from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { Button } from '../../../../../../v2'

/**
 * @deprecated
 */
export const UploadImageButton = () => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor provider is missing')

  return (
    <Button
      size="md"
      variant="ghost"
      className="self-center h-[36px]"
      onClick={() => {
        editor.chain().focus().setImageUploadNode().run()
      }}
    >
      <ImageIcon className="size-8" />
    </Button>
  )
}
