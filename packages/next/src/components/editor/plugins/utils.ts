import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import { $createHeadingNode, type HeadingTagType } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $createParagraphNode, $getSelection, type LexicalEditor } from 'lexical'

export const formatParagraph = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection()
    $setBlocksType(selection, () => $createParagraphNode())
  })
}

export const formatHeading = (
  editor: LexicalEditor,
  blockType: string,
  headingSize: HeadingTagType
) => {
  if (blockType !== headingSize) {
    editor.update(() => {
      const selection = $getSelection()
      $setBlocksType(selection, () => $createHeadingNode(headingSize))
    })
  }
}

export const formatBulletList = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'bullet') {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
  } else {
    formatParagraph(editor)
  }
}

export const formatNumberedList = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'number') {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
  } else {
    formatParagraph(editor)
  }
}
