import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import type { EditorProviderProps, Extensions } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import * as R from 'remeda'
import { toast } from 'sonner'

import type { EditorProviderClientProps, SanitizedExtension } from './types'

import {
  BackColorExtension,
  CustomImageExtension,
  generatePutObjSignedUrlData,
  ImageUploadNodeExtension,
  uploadObject,
} from '../../react'
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
          onError(error) {
            console.log(error)
            toast.error(error.message)
          },
          async upload(file) {
            const name = file.name.split('.').slice(0, -1).join('.')
            const fileType = file.name.split('.').pop()
            const key = `${extension.options.pathName ? `${extension.options.pathName}/` : ''}${name}-${crypto.randomUUID()}.${fileType}`
            const signedUrlPath = storageAdapter.grabPutObjectSignedUrlApiRoute.path
            const putObjSignedUrl = await generatePutObjSignedUrlData(signedUrlPath, key)

            if (!putObjSignedUrl.ok) {
              throw new Error('Generating put object signed URL error: ' + putObjSignedUrl.message)
            }
            const uploadResult = await uploadObject(putObjSignedUrl.data.body.signedUrl, file)
            if (!uploadResult.ok) {
              throw new Error('File upload error: ' + uploadResult.message)
            }

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
export const getEditorProviderClientProps = (
  serverEditorProviderProps: EditorProviderProps
): EditorProviderClientProps => {
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
  ) satisfies EditorProviderClientProps

  return clientEditorProviderProps
}

/**
 * Constructs editor provider props by combining client props with storage adapter
 * @param clientEditorProviderProps - Client-side editor provider configuration
 * @param storageAdapter - Optional storage adapter for handling file uploads
 * @returns Combined editor provider props ready to be used in the client
 */
export const constructEditorProviderProps = (
  clientEditorProviderProps: EditorProviderClientProps,
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
