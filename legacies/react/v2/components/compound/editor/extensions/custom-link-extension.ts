import { mergeAttributes } from '@tiptap/core'
import Link, { type LinkOptions } from '@tiptap/extension-link'

export interface CustomLinkOptions extends LinkOptions {
  siteUrl?: string
}

export const isInternalHref = (href: unknown, siteUrl?: string): boolean => {
  if (typeof href !== 'string' || !siteUrl) return false

  try {
    const resolved = new URL(href, siteUrl)
    return resolved.origin === new URL(siteUrl).origin
  } catch {
    // Unparseable href: treat as external, the safer default.
    return false
  }
}

const isWebHref = (href: unknown) =>
  typeof href === 'string' && /^(https?:|\/|\.|#|\?)/i.test(href.trim())

export const CustomLinkExtension = Link.extend<CustomLinkOptions>({
  inclusive: false,

  addOptions() {
    return {
      ...this.parent?.(),
      siteUrl: undefined,
    } as CustomLinkOptions
  },

  renderHTML({ HTMLAttributes }) {
    const href = HTMLAttributes.href

    if (!isWebHref(href)) {
      return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    }

    const targetAttributes = isInternalHref(href, this.options.siteUrl)
      ? { target: null, rel: null }
      : { target: '_blank', rel: 'noopener noreferrer' }

    return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, targetAttributes), 0]
  },
}).configure({
  openOnClick: false,
  HTMLAttributes: {
    class: 'custom-link',
  },
  protocols: ['http', 'https', 'mailto', 'tel'],
  autolink: true,
  linkOnPaste: true,
})
