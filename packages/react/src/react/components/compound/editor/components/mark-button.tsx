'use client'

import {
  type Icon,
  LinkIcon,
  ListBulletsIcon,
  TextBolderIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { BaseIcon } from '../../../primitives/base-icon'
import { ToolbarItem } from '../../../primitives/toolbar'

type MarkType = 'bold' | 'italic' | 'underline' | 'strike' | 'bulletList' | 'link'

type MarkOptions = Record<
  MarkType,
  { isSelected: boolean; icon: Icon; onClick: () => void; label: string }
>

const useMark = (type: MarkType) => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor provider is missing')

  const options: MarkOptions = {
    bold: {
      label: 'Bold',
      icon: TextBolderIcon,
      isSelected: editor.isActive('bold'),
      onClick() {
        editor.chain().focus().toggleBold().run()
      },
    },
    italic: {
      label: 'Italic',
      icon: TextItalicIcon,
      isSelected: editor.isActive('italic'),
      onClick() {
        editor.chain().focus().toggleItalic().run()
      },
    },
    underline: {
      label: 'Underline',
      icon: TextUnderlineIcon,
      isSelected: editor.isActive('underline'),
      onClick() {
        editor.chain().focus().toggleUnderline().run()
      },
    },
    strike: {
      label: 'Strike',
      icon: TextStrikethroughIcon,
      isSelected: editor.isActive('strike'),
      onClick() {
        editor.chain().focus().toggleStrike().run()
      },
    },
    bulletList: {
      label: 'Bullet List',
      icon: ListBulletsIcon,
      isSelected: editor.isActive('bulletList'),
      onClick() {
        editor.chain().focus().toggleBulletList().run()
      },
    },
    link: {
      label: 'Link',
      icon: LinkIcon,
      isSelected: editor.isActive('link'),
      onClick() {
        if (!editor.isActive('link')) {
          const { state } = editor
          const { from, to } = state.selection
          const currentText = state.doc.textBetween(from, to, '')

          editor.chain().focus().extendMarkRange('link').run()
          editor
            .chain()
            .focus()
            .setMark('link', { href: currentText || 'https://' })
            .run()
          return
        }
        editor.chain().focus().unsetMark('link').run()
      },
    },
  }

  return options[type]
}

export const MarkButton = (props: { type: MarkType }) => {
  const { editor } = useCurrentEditor()
  const markOption = useMark(props.type)

  if (!editor) throw new Error('Editor provider is missing')

  return (
    <ToolbarItem
      size="md"
      variant="default"
      className="duration-150 ease-out transition-all h-[36px]"
      data-selected={markOption.isSelected}
      onClick={markOption.onClick}
      aria-label={markOption.label}
    >
      <BaseIcon icon={markOption.icon} weight={markOption.isSelected ? 'bold' : 'regular'} />
    </ToolbarItem>
  )
}
