'use client'
import React, { useState } from 'react'
import { type Color as ReactAriaColor, parseColor } from 'react-aria-components'

import { SelectionBackgroundIcon } from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { ColorPicker, type ColorPickerProps } from '../../../primitives/color-picker'

/**
 * @deprecated
 */
export const EditorColorPicker = ({
  onPopupClose,
  ...props
}: {
  onPopupClose: (color: ReactAriaColor) => void
} & ColorPickerProps) => {
  const [color, setColor] = useState(parseColor('#000000'))

  return (
    <ColorPicker
      onPopupOpenChange={(isOpen) => {
        if (!isOpen) onPopupClose(color)
      }}
      // value={parseColor('#AAABBB')} // TODO
      eyeDropper
      onChange={setColor}
      {...props}
    />
  )
}

/**
 * @deprecated
 */
export const EditorBgColorPicker = () => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor provider is missing')

  return (
    <EditorColorPicker
      onPopupClose={(color) => {
        editor.chain().setBackColor(color.toString('hex')).run()
      }}
      label={<SelectionBackgroundIcon />}
      buttonClassName="p-4 bg-secondary/25"
    />
  )
}

/**
 * @deprecated
 */
export const EditorTextColorPicker = () => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor provider is missing')

  return (
    <EditorColorPicker
      onPopupClose={(color) => {
        editor.chain().setColor(color.toString('hex')).run()
      }}
      buttonClassName="p-4 bg-secondary/25"
    />
  )
}
