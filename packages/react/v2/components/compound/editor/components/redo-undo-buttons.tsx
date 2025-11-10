'use client'
import { ArrowClockwiseIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { Button } from '../../../../components/primitives/button'

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
      disabled={!editor.can().undo()}
    >
      <ArrowCounterClockwiseIcon className="size-8" />
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
      disabled={!editor.can().redo()}
    >
      <ArrowClockwiseIcon className="size-8" />
    </Button>
  )
}
