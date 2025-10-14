'use client'

import { useEffect } from 'react'

import { type Content, type EditorProviderProps, useEditor } from '@tiptap/react'
import { isDeepEqual } from 'remeda'

import { EditorProvider } from './rich-text-provider'

import { cn } from '../../../../utils/cn'
import { focusStyles } from '../../../primitives'
import { CustomFieldError } from '../../../primitives/custom-field-error'
import { AriaDescription, AriaFieldGroup } from '../../../primitives/field'
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
    if (isDeepEqual(editor.getJSON(), props.value) || props.value === undefined) return
    editor.commands.setContent(props.value)
  }, [props.value])

  return (
    <div className="flex flex-col gap-y-4" data-invalid={true}>
      <AriaFieldGroup
        isDisabled={props.isDisabled}
        isInvalid={isInvalid}
        data-loading={props.isPending ? 'true' : undefined}
        className="overflow-auto relative resize-none w-full"
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
      </AriaFieldGroup>
      {props.description && <AriaDescription>{props.description}</AriaDescription>}
      <CustomFieldError errorMessage={props.errorMessage} />
    </div>
  )
}
