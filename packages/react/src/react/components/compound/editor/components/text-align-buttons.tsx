import React from 'react'
import type { Key } from 'react-aria-components'

import {
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { BaseIcon } from '../../../primitives/base-icon'
import { ToggleGroup } from '../../../primitives/toggle'
import { ToolbarItem } from '../../../primitives/toolbar'

type TextAlignType = 'left' | 'center' | 'right' | 'justify'

const justifyOptions = {
  left: { icon: TextAlignLeftIcon },
  center: { icon: TextAlignCenterIcon },
  right: { icon: TextAlignRightIcon },
  justify: { icon: TextAlignJustifyIcon },
} as const satisfies Record<TextAlignType, { icon: React.ElementType }>

const useCurrentTextAlign = (): TextAlignType => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor provider is missing')

  if (editor.isActive({ textAlign: 'left' })) return 'left'
  if (editor.isActive({ textAlign: 'right' })) return 'right'
  if (editor.isActive({ textAlign: 'center' })) return 'center'
  if (editor.isActive({ textAlign: 'justify' })) return 'justify'

  return 'left'
}

export const TextAlignButton = (props: { type: TextAlignType }) => {
  const currentTextAlign = useCurrentTextAlign()

  const isSelected = currentTextAlign === props.type

  return (
    <ToolbarItem
      size="md"
      id={props.type}
      key={props.type}
      isSelected={isSelected}
      aria-label={`Text align ${props.type}`}
    >
      <BaseIcon icon={justifyOptions[props.type].icon} weight={isSelected ? 'bold' : 'regular'} />
    </ToolbarItem>
  )
}

export const TextAlignButtonsGroup = ({ children }: { children: React.ReactNode }) => {
  const { editor } = useCurrentEditor()
  const currentTextAlign = useCurrentTextAlign()

  if (!editor) throw new Error('Editor provider is missing')

  const selectionChange = (value: Set<Key>) => {
    editor.commands.setTextAlign(value.keys().next().value as string)
  }

  return (
    <ToggleGroup
      selectionMode="single"
      onSelectionChange={selectionChange}
      selectedKeys={[currentTextAlign]}
    >
      {children}
    </ToggleGroup>
  )
}
