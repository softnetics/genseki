import { ImageIcon } from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { Button } from '../../../primitives/button'
import { BaseIcon } from '../../../primitives/base-icon'

const UploadImageButton = () => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor provider is missing')

  return (
    <Button
      size="sm"
      variant="ghost"
      className="self-center p-6"
      onClick={() => {
        editor.chain().focus().setImageUploadNode().run()
      }}
    >
      <BaseIcon icon={ImageIcon} size="sm" weight="regular" />
    </Button>
  )
}

export default UploadImageButton
