import { InputRule, markInputRule, markPasteRule, PasteRule } from '@tiptap/core'
import type { LinkOptions } from '@tiptap/extension-link'
import { Link } from '@tiptap/extension-link'

const inputRegex = /(?:^|\s)\[([^\]]*)?\]\((\S+)(?: ["“](.+)["”])?\)$/i

const pasteRegex = /(?:^|\s)\[([^\]]*)?\]\((\S+)(?: ["“](.+)["”])?\)/gi

function linkInputRule(config: Parameters<typeof markInputRule>[0]) {
  const defaultMarkInputRule = markInputRule(config)

  return new InputRule({
    find: config.find,
    handler(props) {
      const { tr } = props.state

      defaultMarkInputRule.handler(props)
      tr.setMeta('preventAutolink', true)
    },
  })
}

function linkPasteRule(config: Parameters<typeof markPasteRule>[0]) {
  const defaultMarkPasteRule = markPasteRule(config)

  return new PasteRule({
    find: config.find,
    handler(props) {
      const { tr } = props.state

      defaultMarkPasteRule.handler(props)
      tr.setMeta('preventAutolink', true)
    },
  })
}

type CustomLinkExtensionOptions = LinkOptions

const CustomLinkExtension = Link.extend<CustomLinkExtensionOptions>({
  inclusive: false,
  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: 'whenNotEditable',
    }
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      title: {
        default: null,
      },
    }
  },

  addInputRules() {
    return [
      linkInputRule({
        find: inputRegex,
        type: this.type,

        // We need to use `pop()` to remove the last capture groups from the match to
        // satisfy Tiptap's `markPasteRule` expectation of having the content as the last
        // capture group in the match (this makes the attribute order important)
        getAttributes(match) {
          return {
            title: match.pop()?.trim(),
            href: match.pop()?.trim(),
          }
        },
      }),
    ]
  },
  addPasteRules() {
    return [
      linkPasteRule({
        find: pasteRegex,
        type: this.type,

        // We need to use `pop()` to remove the last capture groups from the match to
        // satisfy Tiptap's `markInputRule` expectation of having the content as the last
        // capture group in the match (this makes the attribute order important)
        getAttributes(match) {
          return {
            title: match.pop()?.trim(),
            href: match.pop()?.trim(),
          }
        },
      }),
    ]
  },
})

export { CustomLinkExtension }

export type { CustomLinkExtensionOptions }
