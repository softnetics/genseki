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

import { useMediaQuery } from '../../../hooks/use-media-query'

const MAX_FILE_SIZE = 1024 * 1024 * 10 // 10MB

const handleUploadSuccess = (url: string) => {
  console.log('🎉 Upload sucessfully', url)
}

const handleUploadError = (error: Error) => {
  console.error('Upload failed:', error)
}

export const RichTextEditor = () => {
  const isMobile = useMediaQuery('(min-width: 600px)')

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
            upload: uploadAction,
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
