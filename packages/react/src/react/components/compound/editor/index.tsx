'use client'
import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorProvider } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'

import { EditorBar } from './components/editor-bar'
import { BackColor } from './extensions/background-color-extension'
import { ImageUploadNode } from './extensions/image-upload-node-extension'
import { Selection } from './extensions/selection-extension'
import { uploadAction } from './file-upload-adapters/upload-actions'

const MAX_FILE_SIZE = 1024 * 1024 * 10 // 10MB

const handleUploadSuccess = (url: string) => {
  // TODO: Wait to be merged with Nonmasternon's PR, so the `Sooner` component will be able to handle this error
  console.log('🎉 Upload sucessfully I will show to toast', url)
}

const handleUploadError = (error: Error) => {
  // TODO: Wait to be merged with Nonmasternon's PR, so the `Sooner` component will be able to handle this error
  console.error('Upload failed I will show the toast:', error.message)
}

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
        extensions={[
          StarterKit.configure({
            heading: {
              HTMLAttributes: {
                class: 'heading',
              },
            },
          }),
          Image,
          ImageUploadNode.configure({
            accept: 'image/*',
            maxSize: MAX_FILE_SIZE,
            limit: 3,
            upload: async (file) => {
              console.log(file)
              return 'https://placehold.co/600x400'
            },
            onSuccess: handleUploadSuccess,
            onError: handleUploadError,
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
        ]}
      />
    </div>
  )
}
