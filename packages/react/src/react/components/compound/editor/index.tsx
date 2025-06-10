import './tiptap-style.css'

import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorProvider } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { EditorBar } from './components/editor-bar'
import { BackColor } from './extensions/background-color-extension'
import Selection from './extensions/selection-extension'

const extensions = [
  StarterKit.configure({
    heading: {
      HTMLAttributes: {
        class: 'heading',
      },
    },
  }),
  BackColor,
  Underline,
  Selection,
  TextStyle,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
    defaultAlignment: 'left',
  }),
  Color,
]

export const RichTextEditor = () => {
  return (
    <div className="bg-bg flex flex-col border rounded-xl ">
      <EditorProvider
        onTransaction={({ editor }) => {
          // Listen to change here
          console.log(editor.getJSON())
        }}
        immediatelyRender={false}
        shouldRerenderOnTransaction
        editorContainerProps={{
          className: 'editor-container',
        }}
        editorProps={{
          attributes: {
            'aria-label': 'Main content area, start typing to enter text.',
          },
        }}
        slotBefore={<EditorBar />}
        extensions={extensions}
      />
    </div>
  )
}
