import { mergeAttributes, Node } from '@tiptap/core'

const YOUTUBE_ID = /^[\w-]{6,}$/

export type VideoEmbedProvider = 'youtube' | 'vimeo' | 'tiktok' | 'facebook' | 'generic'

export type VideoEmbedOrientation = 'landscape' | 'portrait'

export interface ResolvedVideoEmbed {
  src: string
  provider: VideoEmbedProvider
  orientation: VideoEmbedOrientation
}

const resolveProvider = (url: URL): ResolvedVideoEmbed | null => {
  // YouTube
  if (url.hostname === 'youtu.be') {
    const id = url.pathname.slice(1)
    return YOUTUBE_ID.test(id)
      ? {
          src: `https://www.youtube.com/embed/${id}`,
          provider: 'youtube',
          orientation: 'landscape',
        }
      : null
  }

  if (/^((www|m)\.)?(youtube\.com|youtube-nocookie\.com)$/.test(url.hostname)) {
    let id: string | null = null
    if (url.pathname === '/watch') id = url.searchParams.get('v')
    else if (url.pathname.startsWith('/embed/')) id = url.pathname.slice('/embed/'.length)
    else if (url.pathname.startsWith('/shorts/')) id = url.pathname.slice('/shorts/'.length)
    else if (url.pathname.startsWith('/live/')) id = url.pathname.slice('/live/'.length)
    return id && YOUTUBE_ID.test(id)
      ? {
          src: `https://www.youtube.com/embed/${id}`,
          provider: 'youtube',
          orientation: url.pathname.startsWith('/shorts/') ? 'portrait' : 'landscape',
        }
      : null
  }

  // Vimeo
  if (/^((www|player)\.)?vimeo\.com$/.test(url.hostname)) {
    const id = url.pathname.split('/').filter(Boolean).pop()
    return id && /^\d+$/.test(id)
      ? { src: `https://player.vimeo.com/video/${id}`, provider: 'vimeo', orientation: 'landscape' }
      : null
  }

  if (/^((www|m)\.)?tiktok\.com$/.test(url.hostname)) {
    if (url.pathname.startsWith('/embed/'))
      return { src: url.href, provider: 'tiktok', orientation: 'portrait' }

    const id = url.pathname.split('/video/')[1]?.split(/[/?]/)[0]
    return id && /^\d+$/.test(id)
      ? {
          src: `https://www.tiktok.com/embed/v2/${id}`,
          provider: 'tiktok',
          orientation: 'portrait',
        }
      : null
  }

  if (/^((www|web|m)\.)?facebook\.com$/.test(url.hostname) || url.hostname === 'fb.watch') {
    // Reels are vertical; ordinary /videos/ and /watch posts are not.
    const orientation: VideoEmbedOrientation = /\/reels?\//.test(url.pathname)
      ? 'portrait'
      : 'landscape'

    if (url.pathname.startsWith('/plugins/'))
      return { src: url.href, provider: 'facebook', orientation }

    return {
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.href)}&show_text=false`,
      provider: 'facebook',
      orientation,
    }
  }

  return null
}

/** Player src and provider for a URL, falling back to the URL as supplied. */
export const resolveVideoEmbed = (value: unknown): ResolvedVideoEmbed => {
  if (typeof value !== 'string') return { src: '', provider: 'generic', orientation: 'landscape' }

  try {
    const url = new URL(value.trim())
    return resolveProvider(url) ?? { src: url.href, provider: 'generic', orientation: 'landscape' }
  } catch {
    return { src: value.trim(), provider: 'generic', orientation: 'landscape' }
  }
}

export type VideoEmbedRejection = 'not-a-url' | 'unsupported-protocol' | 'facebook-share-link'

export const VIDEO_EMBED_REJECTION_MESSAGE: Record<VideoEmbedRejection, string> = {
  'not-a-url': 'Enter a full video URL, starting with https://',
  'unsupported-protocol': 'Only http and https URLs can be embedded.',
  'facebook-share-link':
    'Facebook share links cannot be embedded. Open the video on Facebook and copy the URL from the address bar - it should contain /videos/ or /watch.',
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

  // A /share/ link is a redirect stub.
  if (
    (/^((www|web|m)\.)?facebook\.com$/.test(url.hostname) || url.hostname === 'fb.watch') &&
    url.pathname.startsWith('/share/')
  ) {
    return 'facebook-share-link'
  }

  return null
}

export const isEmbeddableVideoUrl = (value: unknown): value is string =>
  validateVideoEmbedUrl(value) === null

/** Player src for a URL that has already passed validation. */
export const toVideoEmbedSrc = (value: unknown): string => resolveVideoEmbed(value).src

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

    const resolved = resolveVideoEmbed(src)

    return [
      'div',
      mergeAttributes(
        // data-provider lets the stylesheet size each player correctly - TikTok
        // is portrait, the rest are 16/9.
        {
          'data-type': 'video-embed',
          'data-provider': resolved.provider,
          'data-orientation': resolved.orientation,
          class: 'video-embed',
        },
        this.options.HTMLAttributes,
        rest
      ),
      [
        'iframe',
        {
          src: resolved.src,
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
