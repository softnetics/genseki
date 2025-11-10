'use client'
import type React from 'react'

import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

import {
  CustomLinkExtension,
  EditorBar,
  EditorBgColorPicker,
  EditorTextColorPicker,
  MarkButton,
  RedoButton,
  SelectTextStyle,
  TextAlignButton,
  TextAlignButtonsGroup,
  ToolbarGroup,
  ToolbarSeparator,
  UndoButton,
  UploadImageButton,
} from '@genseki/react'
import {
  BackColorExtension,
  CustomImageExtension,
  ImageUploadNodeExtension,
  SelectionExtension,
} from '@genseki/react'

export const EditorSlotBefore = () => {
  return (
    <EditorBar>
      <SelectTextStyle />
      <ToolbarGroup className="items-center">
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="underline" />
        <MarkButton type="link" />
      </ToolbarGroup>
      <ToolbarSeparator className="h-auto" />
      <EditorTextColorPicker />
      <EditorBgColorPicker />
      <ToolbarSeparator className="h-auto" />
      <ToolbarGroup className="items-center">
        <TextAlignButtonsGroup>
          <TextAlignButton type="left" />
          <TextAlignButton type="center" />
          <TextAlignButton type="right" />
          <MarkButton type="bulletList" />
        </TextAlignButtonsGroup>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarSeparator className="h-auto" />
      <UploadImageButton />
      <RedoButton />
      <UndoButton />
    </EditorBar>
  )
}

export const editorProviderProps = {
  immediatelyRender: false,
  shouldRerenderOnTransaction: true,
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: '',
          },
        ],
      },
    ],
  },
  slotBefore: <EditorSlotBefore />,
  extensions: [
    Color,
    BackColorExtension,
    Underline.configure({ HTMLAttributes: { class: 'earth-underline' } }),
    SelectionExtension,
    TextStyle,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),
    StarterKit.configure({
      bold: { HTMLAttributes: { class: 'bold large-black' } },
      paragraph: { HTMLAttributes: { class: 'paragraph-custom' } },
      heading: { HTMLAttributes: { class: 'heading-custom' } },
      bulletList: { HTMLAttributes: { class: 'list-custom' } },
      orderedList: { HTMLAttributes: { class: 'ordered-list' } },
      code: { HTMLAttributes: { class: 'code' } },
      codeBlock: { HTMLAttributes: { class: 'code-block' } },
      horizontalRule: { HTMLAttributes: { class: 'hr-custom' } },
      italic: { HTMLAttributes: { class: 'italic-text' } },
      strike: { HTMLAttributes: { class: 'strikethrough' } },
      blockquote: { HTMLAttributes: { class: 'blockquote-custom' } },
    }),
    CustomImageExtension.configure({ HTMLAttributes: { className: 'image-displayer' } }),
    ImageUploadNodeExtension.configure({
      showProgress: false,
      accept: 'image/*',
      maxSize: 1024 * 1024 * 10, // 10MB
      limit: 3,
      pathName: 'posts/rich-text',
    }),
    CustomLinkExtension,
  ],
}
