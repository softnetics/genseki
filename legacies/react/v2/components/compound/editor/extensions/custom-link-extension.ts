import Link from '@tiptap/extension-link'

export const CustomLinkExtension = Link.extend({
  inclusive: false,
}).configure({
  openOnClick: false,
  HTMLAttributes: {
    class: 'custom-link',
    rel: 'noopener noreferrer',
    target: '_blank',
  },
  protocols: ['http', 'https', 'mailto', 'tel'],
  autolink: true,
  linkOnPaste: true,
})
