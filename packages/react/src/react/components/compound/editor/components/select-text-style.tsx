import React from 'react'
import type { Key } from 'react-aria-components'

import {
  ParagraphIcon,
  TextHFiveIcon,
  TextHFourIcon,
  TextHOneIcon,
  TextHThreeIcon,
  TextHTwoIcon,
} from '@phosphor-icons/react'
import type { Editor } from '@tiptap/core'
import { useCurrentEditor } from '@tiptap/react'

import { BaseIcon } from '../../../primitives/base-icon'
import { Select, SelectList, SelectOption, SelectTrigger } from '../../../primitives/select'

const textStylesList = [
  { icon: ParagraphIcon, label: 'Normal', value: 'p', type: 'paragraph' },
  { icon: TextHOneIcon, label: 'Heading 1', value: 'h1', type: 'heading', level: 1 },
  { icon: TextHTwoIcon, label: 'Heading 2', value: 'h2', type: 'heading', level: 2 },
  { icon: TextHThreeIcon, label: 'Heading 3', value: 'h3', type: 'heading', level: 3 },
  { icon: TextHFourIcon, label: 'Heading 4', value: 'h4', type: 'heading', level: 4 },
  { icon: TextHFiveIcon, label: 'Heading 5', value: 'h5', type: 'heading', level: 5 },
] as const satisfies (
  | { icon: React.ElementType; label: string; value: string; type: 'paragraph' }
  | { icon: React.ElementType; label: string; value: string; type: 'heading'; level: number }
)[]

const getSelectedTextStyle = (editor: Editor) => {
  const isHeading = editor.isActive('heading')
  const isParagraph = editor.isActive('paragraph')

  if (isHeading) {
    return (
      textStylesList
        .filter((textStyle) => textStyle.type === 'heading')
        .find((textStyle) => editor.isActive('heading', { level: textStyle.level }))?.value || 'p'
    )
  }

  if (isParagraph) return 'p'

  return null
}

export const SelectTextStyle = () => {
  const { editor } = useCurrentEditor()
  if (!editor) throw new Error('Editor provider is missing')

  const selectChange = (value: Key) => {
    const selectedStyle = textStylesList.find((textStyle) => textStyle.value === value)

    if (!selectedStyle) {
      console.error('Text style configuration missing')
      return
    }

    if (selectedStyle.type === 'heading') {
      editor.commands.setHeading({
        level: selectedStyle.level,
      })
    }

    if (selectedStyle.type === 'paragraph') {
      editor.commands.setParagraph()
    }

    editor.chain().focus().run()
  }

  return (
    <Select
      selectedKey={getSelectedTextStyle(editor)}
      className="w-72"
      defaultSelectedKey="Normal"
      placeholder="Choose style"
      aria-label="Select text style"
      onSelectionChange={selectChange}
    >
      <SelectTrigger className="h-full" />
      <SelectList items={textStylesList}>
        {(item) => (
          <SelectOption key={item.value} id={item.value} textValue={item.value}>
            <BaseIcon icon={item.icon} size="sm" weight="regular" />
            {item.label}
          </SelectOption>
        )}
      </SelectList>
    </Select>
  )
}
