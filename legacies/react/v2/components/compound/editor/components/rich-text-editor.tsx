'use client'

import { useEffect } from 'react'

import { type Content, type EditorProviderProps, useEditor } from '@tiptap/react'
import { isDeepEqual } from 'remeda'

import { EditorProvider } from './rich-text-provider'

import { CustomFieldError } from '../../../../../src/react/components/primitives/custom-field-error'
// TODO: Migrate to v2
import { Description } from '../../../../../src/react/components/primitives/field'

export interface RichTextEditorProps {
  editorProviderProps: EditorProviderProps
  value?: string | Content | Content[]
  onChange?: (content: string | Content | Content[]) => void
  isDisabled?: boolean
  isRequired?: boolean
  isPending?: boolean
  description?: string
  errorMessage?: string
  label?: string
}

export const RichTextEditor = (props: RichTextEditorProps) => {
  const editor = useEditor({
    ...props.editorProviderProps,
    content: props.value,
    onUpdate({ editor }) {
      props.onChange?.(editor.getJSON())
    },
  })

  useEffect(() => {
    if (!editor) return
    if (props.value !== undefined && !isDeepEqual(editor.getJSON(), props.value)) {
      editor.commands.setContent(props.value)
    }
  }, [editor, props.value])

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!props.isDisabled)
  }, [editor, props.isDisabled])

  return (
    <div className="flex flex-col gap-y-4 w-full" data-invalid={true}>
      <EditorProvider
        {...props.editorProviderProps}
        editor={editor}
        inputGroupProps={{
          isDisabled: props.isDisabled,
          isInvalid: !!props.errorMessage,
          isPending: props.isPending,
        }}
      />
      {props.description && <Description>{props.description}</Description>}
      <CustomFieldError errorMessage={props.errorMessage} />
    </div>
  )
}
