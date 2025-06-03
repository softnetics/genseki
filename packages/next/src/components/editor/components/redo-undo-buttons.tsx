import { ArrowClockwiseIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { Button } from '../../../intentui/ui/button'
import { BaseIcon } from '../../primitives/base-icon'

export const UndoButton = () => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor provider is missing')

  return (
    <Button
      variant="ghost"
      size="md"
      isDisabled={!editor.can().undo()}
      onClick={() => {
        editor.chain().focus().undo().run()
      }}
      className="toolbar-item spaced"
      aria-label="Undo"
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
      variant="ghost"
      size="md"
      isDisabled={!editor.can().redo()}
      onClick={() => {
        editor.chain().focus().redo().run()
      }}
      className="toolbar-item"
      aria-label="Redo"
    >
      <BaseIcon icon={ArrowClockwiseIcon} weight="regular" />
    </Button>
  )
}
