import { useCallback } from 'react'

import { LinkIcon } from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { ToolbarItem } from '@genseki/react'

export const LinkButton = () => {
  const { editor } = useCurrentEditor()
  const isLinkActive = editor?.isActive('link') ?? false

  const handleLinkToggle = useCallback(() => {
    if (!editor) return

    if (isLinkActive) {
      editor.chain().focus().unsetLink().run()
      return
    }

    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, '')

    if (!selectedText) {
      alert('Please select text first')
      return
    }

    const url = prompt('Enter URL:', '')

    if (!url) return

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor, isLinkActive])

  if (!editor) return null

  return (
    <ToolbarItem
      type="button"
      size="md"
      variant="default"
      className="h-18 transition-all duration-150 ease-out"
      data-selected={isLinkActive}
      onClick={handleLinkToggle}
      aria-label="Link"
    >
      <LinkIcon weight={isLinkActive ? 'bold' : 'regular'} />
    </ToolbarItem>
  )
}
