import type { Editor } from '@tiptap/react'
import {
  EditorConsumer,
  EditorContent,
  EditorContext,
  type EditorProviderProps,
  useEditor,
} from '@tiptap/react'

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
            {...editorContainerProps}
            className="min-h-[240px]"
          />
        )}
      </EditorConsumer>
      {children}
      {slotAfter}
    </EditorContext.Provider>
  )
}
