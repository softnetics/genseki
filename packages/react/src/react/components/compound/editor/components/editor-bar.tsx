import { SelectionBackgroundIcon, TextAaIcon } from '@phosphor-icons/react'
import { useCurrentEditor } from '@tiptap/react'

import { EditorColorPicker } from './editor-color-picker'
import { MarkButton } from './mark-button'
import { RedoButton, UndoButton } from './redo-undo-buttons'
import { SelectTextStyle } from './select-text-style'
import { TextAlignButton, TextAlignButtonsGroup } from './text-align-buttons'

import { BaseIcon } from '../../../primitives/base-icon'
import { ToggleGroup } from '../../../primitives/toggle'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '../../../primitives/toolbar'

export const EditorBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor not found')

  return (
    <div className="overflow-x-auto sticky p-2 top-1 m-1 z-10 bg-bg rounded-xl">
      <Toolbar className="flex items-stretch overflow-x-auto">
        <ToolbarGroup>
          <EditorColorPicker
            onPopupClose={(color) => {
              editor.chain().setBackColor(color.toString('hex')).run()
            }}
            label={<BaseIcon icon={SelectionBackgroundIcon} size="md" weight="duotone" />}
            buttonClassName="p-4 border border-border/50 bg-secondary/25"
          />
          <EditorColorPicker
            onPopupClose={(color) => {
              editor.chain().setColor(color.toString('hex')).run()
            }}
            label={<BaseIcon icon={TextAaIcon} size="md" weight="duotone" />}
            buttonClassName="p-4 border border-border/50 bg-secondary/25"
          />
          <SelectTextStyle />
        </ToolbarGroup>
        <ToolbarGroup className="items-center">
          <UndoButton />
          <RedoButton />
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup className="items-center">
          <MarkButton type="bold" />
          <MarkButton type="italic" />
          <MarkButton type="underline" />
          <MarkButton type="strike" />
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToggleGroup className="items-center">
          <MarkButton type="bulletList" />
        </ToggleGroup>
        <ToolbarSeparator />
        <ToolbarGroup className="items-center">
          <TextAlignButtonsGroup>
            <TextAlignButton type="left" />
            <TextAlignButton type="center" />
            <TextAlignButton type="right" />
            <TextAlignButton type="justify" />
          </TextAlignButtonsGroup>
        </ToolbarGroup>
      </Toolbar>
    </div>
  )
}
