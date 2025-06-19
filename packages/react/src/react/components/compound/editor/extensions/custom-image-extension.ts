import Image from '@tiptap/extension-image'

// Custom Image extension that supports data-key attribute
export const CustomImageExtension = Image.extend({
  name: 'customImage',
  addAttributes() {
    return {
      ...this.parent?.(),
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
})
