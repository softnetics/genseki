'use client'

import { useEffect } from 'react'

import { type Content, type EditorProviderProps, useEditor } from '@tiptap/react'

import { EditorProvider } from './rich-text-provider'

import { cn } from '../../../../utils/cn'
import { focusStyles } from '../../../primitives'
import { CustomFieldError } from '../../../primitives/custom-field-error'
import { Description, FieldGroup, Label } from '../../../primitives/field'

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
  const isInvalid = !!props.errorMessage

  const editor = useEditor({
    ...props.editorProviderProps,
    content: props.value,
    onUpdate({ editor }) {
      props.onChange?.(editor.getJSON())
    },
  })

  useEffect(() => {
    if (!editor) return
    if (props.value !== undefined) {
      editor.commands.setContent(props.value)
    }
  }, [props.value, editor])

  return (
    <div className="flex flex-col gap-y-4" data-invalid={true}>
      {props.label && (
        <Label>
          {props.label} {props.isRequired && <span className="ml-1 text-text-brand">*</span>}
        </Label>
      )}
      <FieldGroup
        isDisabled={props.isDisabled}
        isInvalid={isInvalid}
        data-loading={props.isPending ? 'true' : undefined}
        className="overflow-auto relative resize-x"
      >
        <div
          className={cn(
            'relative bg-bg flex flex-col border-none w-full h-full rounded-md',
            props.isDisabled && 'opacity-60 pointer-events-none',
            props.errorMessage && focusStyles.variants.isInvalid
          )}
        >
          <EditorProvider {...props.editorProviderProps} editor={editor} />
        </div>
      </FieldGroup>
      {props.description && <Description>{props.description}</Description>}
      <CustomFieldError errorMessage={props.errorMessage} />
    </div>
  )
}
