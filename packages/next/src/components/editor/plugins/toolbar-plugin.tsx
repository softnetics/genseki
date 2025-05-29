/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { $createListItemNode, $createListNode, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { type HeadingTagType } from '@lexical/rich-text'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'
import {
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBolderIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react'
import {
  $createTextNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  type ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INSERT_LINE_BREAK_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  type LexicalNode,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  type TextFormatType,
  UNDO_COMMAND,
} from 'lexical'

import { formatBulletList, formatHeading, formatParagraph } from './utils'

import { Button } from '../../../intentui/ui/button'
import { Select, SelectList, SelectOption, SelectTrigger } from '../../../intentui/ui/select'
import { ToggleGroup } from '../../../intentui/ui/toggle'
import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSeparator } from '../../../intentui/ui/toolbar'
import { BaseIcon } from '../../primitives/base-icon'

const LowPriority = 1

function $findTopLevelElement(node: LexicalNode) {
  let topLevelElement =
    node.getKey() === 'root'
      ? node
      : $findMatchingParent(node, (e) => {
          const parent = e.getParent()
          return parent !== null && $isRootOrShadowRoot(parent)
        })

  if (topLevelElement === null) {
    topLevelElement = node.getTopLevelElementOrThrow()
  }
  return topLevelElement
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const toolbarRef = useRef(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  // const [blockType, setBlockType] = useState<string | null>(null)

  // useEffect(() => console.log(blockType), [blockType])

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      // const anchorNode = selection.anchor.getNode()
      // const element = $findTopLevelElement(anchorNode)
      // if ($isListNode(element)) {
      //   const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode)
      //   const type = parentList ? parentList.getListType() : element.getListType()
      //   setBlockType(type)
      // }

      // console.log(selection)
      // Update text format
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          const listNode = $createListNode('bullet').append(
            $createListItemNode().append($createTextNode(''))
          )
          $insertNodes([listNode])
          return false
        },
        LowPriority
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
          console.log('DONE 1')
          return false
        },
        LowPriority
      ),
      editor.registerCommand(
        INSERT_LINE_BREAK_COMMAND,
        () => {
          console.log('DONE 2')
          return false
        },
        LowPriority
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar()
          return false
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        LowPriority
      )
    )
  }, [editor, $updateToolbar])

  const formatOptions = useMemo(
    () =>
      [
        {
          icon: TextBolderIcon,
          value: 'bold',
          label: 'Format Bold',
          state: isBold,
        },
        {
          icon: TextItalicIcon,
          value: 'italic',
          label: 'Format Italics',
          state: isItalic,
        },
        {
          icon: TextStrikethroughIcon,
          value: 'strikethrough',
          label: 'Format Strikethrough',
          state: isStrikethrough,
        },
        {
          icon: TextUnderlineIcon,
          value: 'underline',
          label: 'Format Underline',
          state: isUnderline,
        },
      ] satisfies {
        icon: React.ElementType
        value: TextFormatType
        label: string
        state: boolean
      }[],
    [isBold, isItalic, isStrikethrough, isUnderline]
  )

  const justifyOptions = useMemo(
    () =>
      [
        { icon: TextAlignLeftIcon, value: 'left' },
        { icon: TextAlignCenterIcon, value: 'center' },
        { icon: TextAlignRightIcon, value: 'right' },
        { icon: TextAlignJustifyIcon, value: 'justify' },
      ] satisfies { icon: React.ElementType; value: ElementFormatType }[],
    []
  )

  const textStyleMap = {
    'Heading 1': 'h1',
    'Heading 2': 'h2',
    'Heading 3': 'h3',
  } satisfies Record<string, HeadingTagType>

  return (
    <div className="flex">
      <Toolbar orientation="horizontal" aria-label="Toolbars" ref={toolbarRef}>
        <Select
          defaultSelectedKey="Normal"
          aria-label="Select text style"
          onSelectionChange={(value) => {
            if (value === 'Bullet list') {
              formatBulletList(editor, '')
            } else if (value === 'Normal') {
              formatParagraph(editor)
            } else if (Object.keys(textStyleMap).includes(value as string)) {
              formatHeading(editor, '', textStyleMap[value as keyof typeof textStyleMap])
            }
          }}
        >
          <SelectTrigger />
          <SelectList
            items={[
              { name: 'Normal' },
              { name: 'Heading 1' },
              { name: 'Heading 2' },
              { name: 'Heading 3' },
              { name: 'Bullet list' },
            ]}
          >
            {(item) => (
              <SelectOption key={item.name} id={item.name} textValue={item.name}>
                {item.name}
              </SelectOption>
            )}
          </SelectList>
        </Select>
        <ToolbarGroup aria-label="History actions">
          <Button
            variant="vanish"
            size="md"
            isDisabled={!canUndo}
            onClick={() => {
              editor.dispatchCommand(UNDO_COMMAND, undefined)
            }}
            className="toolbar-item spaced"
            aria-label="Undo"
          >
            <BaseIcon icon={ArrowCounterClockwiseIcon} weight="regular" />
          </Button>
          <Button
            variant="vanish"
            size="md"
            isDisabled={!canRedo}
            onClick={() => {
              editor.dispatchCommand(REDO_COMMAND, undefined)
            }}
            className="toolbar-item"
            aria-label="Redo"
          >
            <BaseIcon icon={ArrowClockwiseIcon} weight="regular" />
          </Button>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          {formatOptions.map((format) => (
            <ToolbarItem
              key={format.value}
              size="md"
              isSelected={format.state}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, format.value)
              }}
              className={format.state ? '' : ''}
              aria-label={format.label}
            >
              <BaseIcon icon={format.icon} weight={format.state ? 'bold' : 'regular'} />
            </ToolbarItem>
          ))}
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup aria-label="Alignment" className="flex items-center">
          <ToggleGroup
            selectionMode="single"
            onSelectionChange={(value) => {
              editor.dispatchCommand(
                FORMAT_ELEMENT_COMMAND,
                value.values().next().value as unknown as ElementFormatType
              )
            }}
          >
            {justifyOptions.map((alignment) => (
              <ToolbarItem
                key={alignment.value}
                id={alignment.value}
                aria-label={`Align ${alignment.value}`}
                intent="outline"
              >
                {({ isSelected }) => (
                  <BaseIcon
                    icon={alignment.icon}
                    size="md"
                    weight={isSelected ? 'bold' : 'regular'}
                  />
                )}
              </ToolbarItem>
            ))}
          </ToggleGroup>
        </ToolbarGroup>
      </Toolbar>
    </div>
  )
}
