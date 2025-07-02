import type { HTMLAttributes, ReactNode } from 'react'

import type { ParseOptions } from '@tiptap/pm/model'
import type { EditorProps } from '@tiptap/pm/view'
import type {
  Content,
  EditorProviderProps,
  EnableRules,
  Extension,
  FocusPosition,
} from '@tiptap/react'

import type { Field } from '..'

export interface RichTextServerField extends Extract<Field, { type: 'richText' }> {}

/**
 * @description This is an editor config for client side usage, but hasn't composed in to EditorProviderProps as library need yet.
 */
export interface ClientEditorProviderProps {
  children?: ReactNode
  slotBefore?: ReactNode
  slotAfter?: ReactNode
  editorContainerProps?: HTMLAttributes<HTMLDivElement>

  immediatelyRender?: boolean
  shouldRerenderOnTransaction?: boolean

  element?: Element
  content?: Content
  extensions?: SanitizedExtension[]
  injectCSS?: boolean
  injectNonce?: string | undefined
  autofocus?: FocusPosition
  editable?: boolean
  editorProps?: EditorProps
  parseOptions?: ParseOptions
  coreExtensionOptions?: {
    clipboardTextSerializer?: {
      blockSeparator?: string
    }
  }
  enableInputRules?: EnableRules
  enablePasteRules?: EnableRules
  enableCoreExtensions?:
    | boolean
    | Partial<
        Record<
          | 'editable'
          | 'clipboardTextSerializer'
          | 'commands'
          | 'focusEvents'
          | 'keymap'
          | 'tabindex'
          | 'drop'
          | 'paste',
          false
        >
      >
  enableContentCheck?: boolean
  emitContentError?: boolean
}

export type SanitizedExtension<TExtension extends Extension = Extension> = Omit<
  TExtension,
  'config' | 'configure' | 'extend' | 'parent'
>

/**
 * @description This is an editor config for server side usage, the config need to strip into client editor config.
 */
export type ServerConfigEditorProviderProps = Omit<
  EditorProviderProps,
  | 'onBeforeCreate'
  | 'onCreate'
  | 'onContentError'
  | 'onUpdate'
  | 'onSelectionUpdate'
  | 'onTransaction'
  | 'onFocus'
  | 'onBlur'
  | 'onDestroy'
  | 'onPaste'
  | 'onDrop'
>
