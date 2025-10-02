import type { Editor } from '@tiptap/react'
import {
  EditorConsumer,
  EditorContent,
  EditorContext,
  type EditorProviderProps,
  useEditor,
} from '@tiptap/react'

import { cn } from '../../../../utils/cn'

interface EditorProviderPropsWithEditor extends EditorProviderProps {
  editor?: Editor | null
}

export function EditorProvider({
  children,
  slotAfter,
  slotBefore,
  editorContainerProps = {},
  editor,
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
          <EditorContent
            editor={editorInstance}
            className={cn('min-h-[240px]', editorContainerProps.className)}
            {...editorContainerProps}
          />
        )}
      </EditorConsumer>
      {children}
      {slotAfter}
    </EditorContext.Provider>
  )
}
