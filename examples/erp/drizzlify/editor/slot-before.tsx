'use client'
import {
  EditorBar,
  EditorBarGroup,
  EditorBgColorPicker,
  EditorTextColorPicker,
  MarkButton,
  RedoButton,
  SelectTextStyle,
  TextAlignButton,
  TextAlignButtonsGroup,
  ToggleGroup,
  ToolbarGroup,
  ToolbarSeparator,
  UndoButton,
  UploadImageButton,
} from '@genseki/react'

export const SlotBefore = () => {
  return (
    <EditorBar>
      <EditorBarGroup>
        <EditorBgColorPicker />
        <EditorTextColorPicker />
        <SelectTextStyle />
      </EditorBarGroup>
      <EditorBarGroup className="items-center">
        <UndoButton />
        <RedoButton />
      </EditorBarGroup>
      <ToolbarSeparator className="h-auto" />
      <ToolbarGroup className="items-center">
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="underline" />
        <MarkButton type="strike" />
      </ToolbarGroup>
      <ToolbarSeparator className="h-auto" />
      <ToggleGroup className="items-center">
        <MarkButton type="bulletList" />
      </ToggleGroup>
      <ToolbarSeparator className="h-auto" />
      <ToolbarGroup className="items-center">
        <TextAlignButtonsGroup>
          <TextAlignButton type="left" />
          <TextAlignButton type="center" />
          <TextAlignButton type="right" />
          <TextAlignButton type="justify" />
        </TextAlignButtonsGroup>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarSeparator className="h-auto" />
      <UploadImageButton />
    </EditorBar>
  )
}
