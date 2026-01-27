'use client'

import { PaintBrushBroadIcon } from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { Button } from '../../../../components/primitives/button'

export const AutoTextColorButton = () => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor provider is missing')

  return (
    <Button
      size="md"
      variant="ghost"
      className="toolbar-item spaced"
      onClick={() => {
        editor.chain().focus().unsetColor().run()
      }}
      disabled={!editor.can().unsetColor()}
      title="Reset text color"
    >
      <PaintBrushBroadIcon className="size-8" />
    </Button>
  )
}
