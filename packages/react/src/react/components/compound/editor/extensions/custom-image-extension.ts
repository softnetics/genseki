import type { ChainedCommands } from '@tiptap/core'
import Image, { type ImageOptions } from '@tiptap/extension-image'

import type { StorageAdapterClient } from '../../../../../core/file-storage-adapters'
import { CustomImageNodeWithRenderer } from '../nodes/custom-image-node'

export interface CustomImageOptions extends ImageOptions {
  storageAdapter: StorageAdapterClient
}

// Custom Image extension that only accepts data-key attribute
export const CustomImageExtension = Image.extend<CustomImageOptions>({
  name: 'customImage',
  addAttributes() {
    return {
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      'data-key': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-key'),
        renderHTML: (attributes) => {
          if (!attributes['data-key']) {
            return {}
          }
          return {
            'data-key': attributes['data-key'],
          }
        },
      },
      caption: {
        default: null,
        parseHTML: (element) => {
          if (element.tagName === 'FIGURE') {
            const figcaption = element.querySelector('figcaption')
            return figcaption?.textContent || null
          }
          return element.getAttribute('data-caption')
        },
        renderHTML: (attributes) => {
          if (!attributes.caption) {
            return {}
          }
          return {
            'data-caption': attributes.caption,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[data-key]',
        getAttrs: (element) => ({
          'data-key': element.getAttribute('data-key'),
          alt: element.getAttribute('alt'),
          title: element.getAttribute('title'),
          caption: element.getAttribute('data-caption'),
        }),
      },
      {
        tag: 'figure[data-type="custom-image"]',
        getAttrs: (element) => {
          const img = element.querySelector('img[data-key]')
          const figcaption = element.querySelector('figcaption')

          if (!img) return false

          return {
            'data-key': img.getAttribute('data-key'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            caption: figcaption?.textContent || null,
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, ...imgAttributes } = HTMLAttributes

    if (caption) {
      return [
        'figure',
        { 'data-type': 'custom-image', class: 'custom-image-with-caption' },
        ['img', imgAttributes],
        ['figcaption', { class: 'custom-image-caption' }, caption],
      ]
    }

    return ['img', imgAttributes]
  },

  addCommands() {
    const parentCommands = this.parent?.() || {}

    return {
      ...parentCommands,
      setCustomImage:
        (options: { 'data-key': string; alt?: string; title?: string; caption?: string }) =>
        ({ commands }: { commands: ChainedCommands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
      updateCustomImageCaption:
        (caption: string) =>
        ({ commands }: { commands: ChainedCommands }) => {
          return commands.updateAttributes(this.name, { caption })
        },
    }
  },
  addNodeView() {
    return CustomImageNodeWithRenderer
  },
})
