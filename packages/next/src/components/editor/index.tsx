/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './style.css'

import { ListItemNode, ListNode } from '@lexical/list'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { type InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HeadingNode } from '@lexical/rich-text'
import {
  //  isHTMLElement,
  ParagraphNode,
  TextNode,
} from 'lexical'

import ToolbarPlugin from './plugins/toolbar-plugin'
import { exampleTheme } from './theme/example-theme'

const placeholder = 'Enter some rich text...'

// const removeStylesExportDOM = (editor: LexicalEditor, target: LexicalNode): DOMExportOutput => {
//   const output = target.exportDOM(editor)
//   if (output && isHTMLElement(output.element)) {
//     // Remove all inline styles and classes if the element is an HTMLElement
//     // Children are checked as well since TextNode can be nested
//     // in i, b, and strong tags.
//     for (const el of [
//       output.element,
//       ...Array.from(output.element.querySelectorAll('[style],[class],[dir="ltr"]')),
//     ]) {
//       el.removeAttribute('class')
//       el.removeAttribute('style')
//       if (el.getAttribute('dir') === 'ltr') {
//         el.removeAttribute('dir')
//       }
//     }
//   }
//   return output
// }

// const exportMap: DOMExportOutputMap = new Map<
//   Klass<LexicalNode>,
//   (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
// >([
//   [ParagraphNode, removeStylesExportDOM],
//   [TextNode, removeStylesExportDOM],
// ])

// const getExtraStyles = (element: HTMLElement): string => {
//   // Parse styles from pasted input, but only if they match exactly the
//   // sort of styles that would be produced by exportDOM
//   let extraStyles = ''
//   const fontSize = parseAllowedFontSize(element.style.fontSize)
//   const backgroundColor = parseAllowedColor(element.style.backgroundColor)
//   const color = parseAllowedColor(element.style.color)
//   if (fontSize !== '' && fontSize !== '15px') {
//     extraStyles += `font-size: ${fontSize};`
//   }
//   if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
//     extraStyles += `background-color: ${backgroundColor};`
//   }
//   if (color !== '' && color !== 'rgb(0, 0, 0)') {
//     extraStyles += `color: ${color};`
//   }
//   return extraStyles
// }

// const constructImportMap = (): DOMConversionMap => {
//   const importMap: DOMConversionMap = {}

//   // Wrap all TextNode importers with a function that also imports
//   // the custom styles implemented by the playground
//   for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
//     importMap[tag] = (importNode) => {
//       const importer = fn(importNode)
//       if (!importer) {
//         return null
//       }
//       return {
//         ...importer,
//         conversion: (element) => {
//           const output = importer.conversion(element)
//           if (
//             output === null ||
//             output.forChild === undefined ||
//             output.after !== undefined ||
//             output.node !== null
//           ) {
//             return output
//           }
//           const extraStyles = getExtraStyles(element)
//           if (extraStyles) {
//             const { forChild } = output
//             return {
//               ...output,
//               forChild: (child, parent) => {
//                 const textNode = forChild(child, parent)
//                 if ($isTextNode(textNode)) {
//                   textNode.setStyle(textNode.getStyle() + extraStyles)
//                 }
//                 return textNode
//               },
//             }
//           }
//           return output
//         },
//       }
//     }
//   }

//   return importMap
// }

const editorConfig = {
  html: {
    // export: exportMap,
    // import: constructImportMap(),
  },
  namespace: 'Kivotos editor',
  theme: exampleTheme,
  nodes: [ParagraphNode, TextNode, ListNode, ListItemNode, HeadingNode],
  onError(error: Error) {
    throw error
  },
} satisfies InitialConfigType

export function Editor() {
  return (
    <div className="p-4 border rounded-xl">
      <LexicalComposer initialConfig={editorConfig}>
        <div>
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-input"
                  aria-placeholder={placeholder}
                  placeholder={<div className="editor-placeholder">{placeholder}</div>}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
          </div>
        </div>
      </LexicalComposer>
    </div>
  )
}
