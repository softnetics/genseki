import React from 'react'

import {
  type Icon,
  ListBulletsIcon,
  TextBolderIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { ToolbarItem } from '../../../intentui/ui/toolbar'
import { BaseIcon } from '../../primitives/base-icon'

type MarkType = 'bold' | 'italic' | 'underline' | 'strike' | 'bulletList'

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
      className="duration-150 ease-out transition-all"
      isSelected={markOption.isSelected}
      onClick={markOption.onClick}
      aria-label={markOption.label}
    >
      <BaseIcon icon={markOption.icon} weight={markOption.isSelected ? 'bold' : 'regular'} />
    </ToolbarItem>
  )
}
