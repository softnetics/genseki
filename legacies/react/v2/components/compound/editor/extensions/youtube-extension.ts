import Youtube from '@tiptap/extension-youtube'

/**
 * Mirrors the regex `@tiptap/extension-youtube` validates with. Copied rather
 * than imported: the package exports only its root entry, and `isValidYoutubeUrl`
 * is not part of it.
 */
const YOUTUBE_URL =
  /^((?:https?:)?\/\/)?((?:www|m|music)\.)?((?:youtube\.com|youtu\.be|youtube-nocookie\.com))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/

export const isYoutubeUrl = (url: unknown): url is string =>
  typeof url === 'string' && YOUTUBE_URL.test(url.trim())

export const YoutubeExtension = Youtube.configure({
  addPasteHandler: false,
  controls: true,
  nocookie: true,
  allowFullscreen: true,
})
