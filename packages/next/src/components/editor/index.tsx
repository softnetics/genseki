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

import { useMediaQuery } from '../../intentui/utils/use-media-query'

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
  const isMobile = useMediaQuery('(max-width: 600px)')

  return (
    <div className="bg-bg flex flex-col gap-4 border p-4 rounded-xl">
      <EditorProvider
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
        content={`
          <p>Hello World! 🌎️</p> <p>HELLO</p>
          <p>xxx</p>`}
      />
    </div>
  )
}
