import { mergeAttributes, Node } from '@tiptap/core'

const YOUTUBE_ID = /^[\w-]{6,}$/

// `youtube.com/watch?v=X` refuses framing; `youtube.com/embed/X` works.
const normaliseEmbedSrc = (url: URL): string | null => {
  if (url.hostname === 'youtu.be') {
    const id = url.pathname.slice(1)
    return YOUTUBE_ID.test(id) ? `https://www.youtube.com/embed/${id}` : null
  }

  if (/^((www|m)\.)?(youtube\.com|youtube-nocookie\.com)$/.test(url.hostname)) {
    let id: string | null = null
    if (url.pathname === '/watch') id = url.searchParams.get('v')
    else if (url.pathname.startsWith('/embed/')) id = url.pathname.slice('/embed/'.length)
    else if (url.pathname.startsWith('/shorts/')) id = url.pathname.slice('/shorts/'.length)
    else if (url.pathname.startsWith('/live/')) id = url.pathname.slice('/live/'.length)
    return id && YOUTUBE_ID.test(id) ? `https://www.youtube.com/embed/${id}` : null
  }

  if (/^((www|player)\.)?vimeo\.com$/.test(url.hostname)) {
    const id = url.pathname.split('/').filter(Boolean).pop()
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null
  }

  return null
}

export type VideoEmbedRejection = 'not-a-url' | 'unsupported-protocol'

export const VIDEO_EMBED_REJECTION_MESSAGE: Record<VideoEmbedRejection, string> = {
  'not-a-url': 'Enter a full video URL, starting with https://',
  'unsupported-protocol': 'Only http and https URLs can be embedded.',
}

export const validateVideoEmbedUrl = (value: unknown): VideoEmbedRejection | null => {
  if (typeof value !== 'string' || value.trim() === '') return 'not-a-url'

  let url: URL
  try {
    // No base on purpose: a relative value is not a usable embed source.
    url = new URL(value.trim())
  } catch {
    return 'not-a-url'
  }

  // `javascript:` and `data:` parse as perfectly valid URLs, which is exactly
  // why this check is the one that matters. A `javascript:` iframe src executes
  // against the host page
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return 'unsupported-protocol'

  return null
}

export const isEmbeddableVideoUrl = (value: unknown): value is string =>
  validateVideoEmbedUrl(value) === null

export const toVideoEmbedSrc = (value: unknown): string => {
  if (typeof value !== 'string') return ''

  try {
    const url = new URL(value.trim())
    return normaliseEmbedSrc(url) ?? url.href
  } catch {
    return value.trim()
  }
}

export type VideoEmbedOptions = {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoEmbed: {
      setVideoEmbed: (options: { src: string }) => ReturnType
    }
  }
}

export const VideoEmbedExtension = Node.create<VideoEmbedOptions>({
  name: 'videoEmbed',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="video-embed"]',
        getAttrs: (element) => {
          const src = (element as HTMLElement).querySelector('iframe')?.getAttribute('src')
          if (!isEmbeddableVideoUrl(src)) return false
          return { src }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, ...rest } = HTMLAttributes

    if (!isEmbeddableVideoUrl(src)) return ['div', { 'data-type': 'video-embed-invalid' }]

    return [
      'div',
      mergeAttributes(
        { 'data-type': 'video-embed', class: 'video-embed' },
        this.options.HTMLAttributes,
        rest
      ),
      [
        'iframe',
        {
          src: toVideoEmbedSrc(src),
          sandbox: 'allow-scripts allow-same-origin allow-presentation',
          referrerpolicy: 'strict-origin-when-cross-origin',
          loading: 'lazy',
          allowfullscreen: 'true',
          frameborder: '0',
        },
      ],
    ]
  },

  addCommands() {
    return {
      setVideoEmbed:
        (options) =>
        ({ commands }) => {
          if (!isEmbeddableVideoUrl(options.src)) return false
          return commands.insertContent({
            type: this.name,
            attrs: { src: toVideoEmbedSrc(options.src) },
          })
        },
    }
  },
})
