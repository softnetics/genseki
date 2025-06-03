import { useState } from 'react'
import { type Color as ReactAriaColor, parseColor } from 'react-aria-components'

import { ColorPicker, type ColorPickerProps } from '../../../intentui/ui/color-picker'

export const EditorColorPicker = ({
  onPopupClose,
  ...props
}: {
  onPopupClose: (color: ReactAriaColor) => void
} & ColorPickerProps) => {
  const [color, setColor] = useState(parseColor('#000000'))

  return (
    <>
      <ColorPicker
        onPopupOpenChange={(isOpen) => {
          if (!isOpen) onPopupClose(color)
        }}
        eyeDropper
        onChange={setColor}
        {...props}
      />
    </>
  )
}
