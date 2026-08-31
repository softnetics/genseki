'use client'

import { TextIndentIcon, TextOutdentIcon } from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { ToolbarItem } from '../../../../../src/react/components/primitives/toolbar'

export const IndentButton = () => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor provider is missing')

  return (
    <ToolbarItem
      size="md"
      variant="default"
      className="duration-150 ease-out transition-all h-18"
      onClick={() => editor.chain().focus().indent().run()}
      type="button"
      aria-label="Increase Indent"
    >
      <TextIndentIcon weight="regular" />
    </ToolbarItem>
  )
}

export const OutdentButton = () => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor provider is missing')

  return (
    <ToolbarItem
      size="md"
      variant="default"
      className="duration-150 ease-out transition-all h-18"
      onClick={() => editor.chain().focus().outdent().run()}
      type="button"
      aria-label="Decrease Indent"
    >
      <TextOutdentIcon weight="regular" />
    </ToolbarItem>
  )
}
