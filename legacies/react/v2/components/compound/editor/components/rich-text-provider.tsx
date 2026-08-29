import type { Editor } from '@tiptap/react'
import {
  EditorConsumer,
  EditorContent,
  EditorContext,
  type EditorProviderProps,
  useEditor,
} from '@tiptap/react'

import { cn } from '../../../../../src/react/utils/cn'
import { InputGroup, InputGroupControl } from '../../../primitives'

const DEFAULT_MIN_HEIGHT_CLASS_NAME = 'min-h-[240px]'

export interface EditorProviderPropsWithEditor extends EditorProviderProps {
  editor?: Editor | null
  inputGroupProps?: {
    isInvalid?: boolean
    isDisabled?: boolean
    isPending?: boolean
  }
  minHeightClassName?: string
  maxHeightClassName?: string | null
}

export function EditorProvider({
  children,
  slotAfter,
  slotBefore,
  editorContainerProps = {},
  editor,
  inputGroupProps,
  minHeightClassName = DEFAULT_MIN_HEIGHT_CLASS_NAME,
  maxHeightClassName = null,
  ...editorOptions
}: EditorProviderPropsWithEditor) {
  const editorInstance = editor ?? useEditor(editorOptions)

  if (!editorInstance) {
    return null
  }

  return (
    <EditorContext.Provider value={{ editor: editorInstance }}>
      {slotBefore}
      <EditorConsumer>
        {() => (
          <InputGroup
            className="h-auto focus-within:border-ring focus-within:ring-ring/20 focus-within:ring-4"
            aria-invalid={inputGroupProps?.isInvalid}
            aria-disabled={inputGroupProps?.isDisabled}
            isPending={inputGroupProps?.isPending}
          >
            <InputGroupControl>
              <EditorContent
                editor={editorInstance}
                className={cn(
                  'rounded-md! bg-white w-full outline-none overflow-y-auto tiptap-content-editor',
                  minHeightClassName,
                  maxHeightClassName,
                  editorContainerProps.className
                )}
                data-slot="input-group-control"
                {...editorContainerProps}
              />
            </InputGroupControl>
          </InputGroup>
        )}
      </EditorConsumer>
      {children}
      {slotAfter}
    </EditorContext.Provider>
  )
}
