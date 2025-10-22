'use client'
import { ArrowClockwiseIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { Button } from '../../../../../../v2'
import { BaseIcon } from '../../../primitives/base-icon'

export const UndoButton = () => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor provider is missing')

  return (
    <Button
      size="md"
      variant="ghost"
      className="toolbar-item spaced"
      onClick={() => {
        editor.chain().focus().undo().run()
      }}
      aria-label="Undo"
      disabled={!editor.can().undo()}
    >
      <BaseIcon icon={ArrowCounterClockwiseIcon} weight="regular" />
    </Button>
  )
}

export const RedoButton = () => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor provider is missing')

  return (
    <Button
      size="md"
      variant="ghost"
      className="duration-150 ease-out transition-all h-[36px]"
      onClick={() => {
        editor.chain().focus().redo().run()
      }}
      aria-label="Redo"
      disabled={!editor.can().redo()}
    >
      <BaseIcon icon={ArrowClockwiseIcon} weight="regular" />
    </Button>
  )
}
