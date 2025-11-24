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

interface EditorProviderPropsWithEditor extends EditorProviderProps {
  editor?: Editor | null
  inputGroupProps?: {
    isInvalid?: boolean
    isDisabled?: boolean
    isPending?: boolean
  }
}

export function EditorProvider({
  children,
  slotAfter,
  slotBefore,
  editorContainerProps = {},
  editor,
  inputGroupProps,
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
                  '!rounded-md min-h-[240px] max-h-[240px] bg-white w-full outline-none overflow-y-auto',
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
