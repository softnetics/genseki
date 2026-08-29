import { mergeAttributes, Node } from '@tiptap/core'

import { VideoEmbedInputNodeWithRenderer } from '../components/video-embed-input-node'

export type VideoEmbedInputOptions = {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoEmbedInput: {
      setVideoEmbedInputNode: () => ReturnType
    }
  }
}

export const VideoEmbedInputExtension = Node.create<VideoEmbedInputOptions>({
  name: 'videoEmbedInput',
  group: 'block',
  atom: true,
  draggable: false,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="video-embed-input"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-type': 'video-embed-input' }, HTMLAttributes)]
  },

  addNodeView() {
    return VideoEmbedInputNodeWithRenderer
  },

  addCommands() {
    return {
      setVideoEmbedInputNode:
        () =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name })
        },
    }
  },
})
