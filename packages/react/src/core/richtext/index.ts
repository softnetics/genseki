import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import type { EditorProviderProps, Extensions } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import * as R from 'remeda'

import type { ClientEditorProviderProps, SanitizedExtension } from './types'

import { BackColorExtension, CustomImageExtension, ImageUploadNodeExtension } from '../../react'
import { SelectionExtension } from '../../react/components/compound/editor/extensions/selection-extension'
import type { StorageAdapterClient } from '../file-storage-adapters'

/**
 * Sanitizes editor extensions by removing sensitive configuration and unsanitizable data
 * @param unSanitizedExtensions - Raw editor extensions to sanitize
 * @returns Sanitized extensions safe for client-side use
 */
const getSanitizedExtensions = (unSanitizedExtensions: Extensions): SanitizedExtension[] => {
  const sanitizedExtensions = unSanitizedExtensions.map((extension) => {
    switch (extension.name) {
      case 'customImage':
        return R.omit(extension, ['config', 'parent'])
      case 'starterKit':
      case 'underline':
      case 'selection':
      case 'textAlign':
      case 'textStyle':
      case 'backColor':
      case 'color':
      case 'image':
      case 'imageUpload':
        return R.omit(extension, ['config'])
      default:
        throw new Error(`Unknown extension name: ${extension.name}`)
    }
  })

  // console.log('Sanitized extensions ✨\n', unSanitizedExtensions, sanitizedExtensions)

  return sanitizedExtensions as SanitizedExtension[]
}

/**
 * Constructs sanitized extensions for editor initialization
 * @param sanitizedExtensions - Pre-sanitized extensions to process
 */
export const constructSanitizedExtensions = (
  sanitizedExtensions: SanitizedExtension[],
  storageAdapter?: StorageAdapterClient
) => {
  const tiptapExtensions = sanitizedExtensions.map((extension) => {
    switch (extension.name) {
      case 'starterKit':
        return StarterKit.configure(extension.options)
      case 'underline':
        return Underline.configure(extension.options)
      case 'selection':
        return SelectionExtension.configure(extension.options)
      case 'textAlign':
        return TextAlign.configure(extension.options)
      case 'textStyle':
        return TextStyle.configure(extension.options)
      case 'backColor':
        return BackColorExtension.configure(extension.options)
      case 'color':
        return Color.configure(extension.options)
      case 'image':
        return Image.configure(extension.options)
      case 'customImage':
        if (!storageAdapter) throw new Error("Storage adapter isn't defined at the server config")
        return CustomImageExtension.configure({
          ...extension.options,
          storageAdapter,
        })
      case 'imageUpload':
        if (!storageAdapter) throw new Error("Storage adapter isn't defined at the server config")
        return ImageUploadNodeExtension.configure({
          ...extension.options,
          async upload(file) {
            const key = `${crypto.randomUUID()}-${file.name}`

            // Upload image
            const putObjSignedUrlApiRoute = storageAdapter.grabPutObjectSignedUrlApiRoute
            const grabPutObjUrlEndpoint = new URL(
              putObjSignedUrlApiRoute.path,
              window.location.origin
            )
            grabPutObjUrlEndpoint.searchParams.append('key', key)
            const putObjSignedUrl = await fetch(grabPutObjUrlEndpoint.toString())
            const putObjSignedUrlData = await putObjSignedUrl.json()
            await fetch(putObjSignedUrlData.signedUrl, {
              method: 'PUT',
              body: file,
            })

            return { key }
          },
        })
      default:
        throw new Error(`Unknown extension name: ${extension.name}`)
    }
  })

  return tiptapExtensions
}
/**
 * Prepares editor provider props for client-side use by sanitizing extensions
 * and setting up event handlers
 * @param serverEditorProviderProps - Raw editor provider configuration
 * @returns Sanitized editor provider props safe for client-side use
 */
export const getClientEditorProviderProps = (
  serverEditorProviderProps: EditorProviderProps
): ClientEditorProviderProps => {
  const sanitizedExtensions = getSanitizedExtensions(serverEditorProviderProps.extensions ?? [])

  const clientEditorProviderProps = R.pipe(
    serverEditorProviderProps,
    R.omit([
      'extensions',
      'onBeforeCreate',
      'onCreate',
      'onUpdate',
      'onSelectionUpdate',
      'onTransaction',
      'onFocus',
      'onBlur',
      'onDestroy',
    ]),
    R.merge({ extensions: sanitizedExtensions })
  ) satisfies ClientEditorProviderProps

  return clientEditorProviderProps
}

/**
 * Constructs editor provider props by combining client props with storage adapter
 * @param clientEditorProviderProps - Client-side editor provider configuration
 * @param storageAdapter - Optional storage adapter for handling file uploads
 * @returns Combined editor provider props ready to be used in the client
 */
export const constructEditorProviderProps = (
  clientEditorProviderProps: ClientEditorProviderProps,
  storageAdapter?: StorageAdapterClient
): EditorProviderProps => {
  const extensions = constructSanitizedExtensions(
    clientEditorProviderProps.extensions ?? [],
    storageAdapter
  )

  return {
    ...clientEditorProviderProps,
    extensions: extensions || [],
  } satisfies EditorProviderProps
}
