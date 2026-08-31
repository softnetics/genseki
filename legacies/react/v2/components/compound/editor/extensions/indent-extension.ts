import { type CommandProps, Extension } from '@tiptap/core'

export const MIN_INDENT_LEVEL = 0
export const MAX_INDENT_LEVEL = 4

export type IndentOptions = {
  types: string[]
  minLevel: number
  maxLevel: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType
      outdent: () => ReturnType
    }
  }
}

const clamp = (level: number, min: number, max: number) => Math.min(Math.max(level, min), max)

export const IndentExtension = Extension.create<IndentOptions>({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      minLevel: MIN_INDENT_LEVEL,
      maxLevel: MAX_INDENT_LEVEL,
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const raw = Number(element.getAttribute('data-indent'))
              if (!Number.isFinite(raw)) return 0
              return clamp(Math.trunc(raw), this.options.minLevel, this.options.maxLevel)
            },
            renderHTML: (attributes) => {
              if (!attributes.indent) return {}
              return { 'data-indent': String(attributes.indent) }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    const shiftIndent =
      (delta: number) =>
      ({ state, tr, dispatch }: CommandProps) => {
        const { from, to } = state.selection
        let changed = false

        state.doc.nodesBetween(from, to, (node, pos) => {
          if (!this.options.types.includes(node.type.name)) return

          const current = Number(node.attrs.indent) || 0
          const next = clamp(current + delta, this.options.minLevel, this.options.maxLevel)
          if (next === current) return

          tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: next })
          changed = true
        })

        if (changed && dispatch) dispatch(tr)
        return changed
      }

    return {
      indent: () => shiftIndent(1),
      outdent: () => shiftIndent(-1),
    }
  },

  addKeyboardShortcuts() {
    const isIndentable = (editor: { isActive: (name: string) => boolean }) =>
      !editor.isActive('listItem') &&
      !editor.isActive('taskItem') &&
      this.options.types.some((type) => editor.isActive(type))

    return {
      Tab: ({ editor }) => (isIndentable(editor) ? editor.commands.indent() : false),
      'Shift-Tab': ({ editor }) => (isIndentable(editor) ? editor.commands.outdent() : false),
      'Mod-]': ({ editor }) => editor.commands.indent(),
      'Mod-[': ({ editor }) => editor.commands.outdent(),
    }
  },
})
