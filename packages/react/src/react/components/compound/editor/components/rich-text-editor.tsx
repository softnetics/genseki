'use client'

import { EditorProvider, type EditorProviderProps } from '@tiptap/react'

import { cn } from '../../../../utils/cn'
import { focusStyles } from '../../../primitives'
import { CustomFieldError } from '../../../primitives/custom-field-error'
import { Description, FieldGroup, Label } from '../../../primitives/field'

export interface RichTextEditorProps {
  editorProviderProps: EditorProviderProps
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
          <EditorProvider
            immediatelyRender={false}
            shouldRerenderOnTransaction
            editorContainerProps={{
              className: 'editor-container',
            }}
            {...props.editorProviderProps}
          />
        </div>
      </FieldGroup>
      {props.description && <Description>{props.description}</Description>}
      <CustomFieldError errorMessage={props.errorMessage} />
    </div>
  )
}
