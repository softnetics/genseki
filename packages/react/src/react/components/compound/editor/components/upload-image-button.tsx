'use client'
import { ImageIcon } from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { Button } from '../../../../../../v2'
import { BaseIcon } from '../../../primitives/base-icon'

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
      <BaseIcon icon={ImageIcon} size="sm" weight="regular" />
    </Button>
  )
}
