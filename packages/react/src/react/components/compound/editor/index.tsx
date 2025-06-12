'use client'
import { FieldErrorContext } from 'react-aria-components'

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

import type { RichTextOptions } from '../../../../core/field'
import { cn } from '../../../utils/cn'
import { focusStyles } from '../../primitives'
import { Description, FieldError, FieldGroup, Label } from '../../primitives/field'

const MAX_FILE_SIZE = 1024 * 1024 * 10 // 10MB

const handleUploadSuccess = (url: string) => {
  // TODO: Wait to be merged with Nonmasternon's PR, so the `Sooner` component will be able to handle this error
  console.log('🎉 Upload sucessfully I will show to toast', url)
}

const handleUploadError = (error: Error) => {
  // TODO: Wait to be merged with Nonmasternon's PR, so the `Sooner` component will be able to handle this error
  console.error('Upload failed I will show the toast:', error.message)
}

const defaultExtensions = [
  BackColor,
  Underline,
  Selection,
  TextStyle,
  Color,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
    defaultAlignment: 'left',
  }),
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
      console.log('uploading', file)
      return 'https://placehold.co/600x400'
    },
    // upload: uploadAction,
    onSuccess: handleUploadSuccess,
    onError: handleUploadError,
  }),
]

export interface RichTextEditorProps extends RichTextOptions {
  isDisabled?: boolean
  isRequired?: boolean
  isPending?: boolean
  description?: string
  errorMessage?: string
  label?: string
}

export const RichTextEditor = (props: RichTextEditorProps) => {
  const isInvalid = !!props.errorMessage

  return (
    <div className="flex flex-col gap-y-1.5" data-invalid={true}>
      {props.label && (
        <Label>
          {props.label} {props.isRequired && <span className="ml-1 text-red-500">*</span>}
        </Label>
      )}
      <FieldGroup
        isDisabled={props.isDisabled}
        isInvalid={isInvalid}
        data-loading={props.isPending ? 'true' : undefined}
        className="overflow-visible resize-x"
      >
        <div
          className={cn(
            'relative bg-bg flex flex-col border-none w-full h-full rounded-md',
            props.isDisabled && 'opacity-60 pointer-events-none',
            props.errorMessage && focusStyles.variants.isInvalid
          )}
        >
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
            slotBefore={<EditorBar />}
            extensions={[...defaultExtensions, ...(props.editorProviderOptions.extensions || [])]}
            {...props.editorProviderOptions}
          />
        </div>
      </FieldGroup>
      {props.description && <Description>{props.description}</Description>}
      <CustomFieldErrpr errorMessage={props.errorMessage} />
    </div>
  )
}

const CustomFieldErrpr = (props: { errorMessage?: string }) => {
  return (
    <FieldErrorContext
      value={{
        isInvalid: !!props.errorMessage,
        validationErrors: props.errorMessage ? [props.errorMessage] : [],
        validationDetails: {
          badInput: false,
          customError: false,
          patternMismatch: false,
          rangeOverflow: false,
          rangeUnderflow: false,
          stepMismatch: false,
          tooLong: false,
          tooShort: false,
          typeMismatch: false,
          valid: true,
          valueMissing: false,
        },
      }}
    >
      <FieldError>{props.errorMessage}</FieldError>
    </FieldErrorContext>
  )
}
