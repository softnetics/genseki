'use client'

import { useEffect } from 'react'

import { type Content, type EditorProviderProps, useEditor } from '@tiptap/react'
import { isDeepEqual } from 'remeda'

import { EditorProvider } from './rich-text-provider'

import { CustomFieldError } from '../../../primitives/custom-field-error'
import { Description } from '../../../primitives/field'

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
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
    if (isDeepEqual(editor.getJSON(), props.value) || props.value === undefined) return
    editor.commands.setContent(props.value)
  }, [props.value])

  return (
    <div className="flex flex-col gap-y-4" data-invalid={true}>
      <EditorProvider
        {...props.editorProviderProps}
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
