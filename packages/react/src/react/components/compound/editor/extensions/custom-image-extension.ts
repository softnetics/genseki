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
    }
  },
  addNodeView() {
    return CustomImageNodeWithRenderer
  },
})
