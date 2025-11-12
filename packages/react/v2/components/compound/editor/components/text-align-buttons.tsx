'use client'

import React, { createContext, useContext } from 'react'

import {
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

// TODO: Migrate to v2
import { ToolbarItem } from '../../../../../src/react/components/primitives/toolbar'
import { ToggleGroup, ToggleGroupItem } from '../../../../components/primitives/toggle-group'

type TextAlignType = 'left' | 'center' | 'right' | 'justify'

const justifyOptions = {
  left: { icon: TextAlignLeftIcon },
  center: { icon: TextAlignCenterIcon },
  right: { icon: TextAlignRightIcon },
  justify: { icon: TextAlignJustifyIcon },
} as const satisfies Record<TextAlignType, { icon: React.ElementType }>

interface TextAlignGroupContextValue {
  currentAlign: TextAlignType
  setAlign: (value: TextAlignType) => void
}

const TextAlignGroupContext = createContext<TextAlignGroupContextValue | null>(null)

const useTextAlignGroup = () => {
  const ctx = useContext(TextAlignGroupContext)
  if (!ctx) throw new Error('TextAlignButton must be used inside TextAlignButtonsGroup')
  return ctx
}

const useCurrentTextAlign = (editor: any): TextAlignType => {
  if (!editor) throw new Error('Editor provider is missing')

  if (editor.isActive({ textAlign: 'right' })) return 'right'
  if (editor.isActive({ textAlign: 'center' })) return 'center'
  if (editor.isActive({ textAlign: 'justify' })) return 'justify'
  return 'left'
}

export const TextAlignButtonsGroup = ({ children }: { children: React.ReactNode }) => {
  const { editor } = useCurrentEditor()
  if (!editor) throw new Error('Editor provider is missing')

  const currentAlign = useCurrentTextAlign(editor)

  const handleValueChange = (value: string) => {
    if (!value) return
    editor.chain().focus().setTextAlign(value).run()
  }

  return (
    <TextAlignGroupContext.Provider value={{ currentAlign, setAlign: handleValueChange }}>
      <ToggleGroup
        type="single"
        value={currentAlign}
        onValueChange={handleValueChange}
        aria-label="Text alignment"
      >
        {children}
      </ToggleGroup>
    </TextAlignGroupContext.Provider>
  )
}

export const TextAlignButton = ({ type }: { type: TextAlignType }) => {
  const { currentAlign } = useTextAlignGroup()
  const Icon = justifyOptions[type].icon
  const isSelected = currentAlign === type

  return (
    <ToggleGroupItem value={type} aria-label={`Align ${type}`} asChild>
      <ToolbarItem
        variant="default"
        data-selected={isSelected}
        aria-label={`Text align ${type}`}
        className="size-[36px]"
      >
        <Icon weight={isSelected ? 'bold' : 'regular'} className="size-8" />
      </ToolbarItem>
    </ToggleGroupItem>
  )
}
