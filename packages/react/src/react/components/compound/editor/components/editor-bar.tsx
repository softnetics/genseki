'use client'
import type React from 'react'

import { useCurrentEditor } from '@tiptap/react'

import { cn } from '../../../../utils/cn'
import { Toolbar, ToolbarGroup } from '../../../primitives/toolbar'

/**
 * @deprecated
 */
export const EditorBarGroup = ToolbarGroup

/**
 * @deprecated
 */
export const EditorBar: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className,
  children,
}) => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor not found')

  return (
    <div
      className={cn(
        'overflow-x-auto self-start sticky top-1 z-11 bg-bg rounded-lg w-full flex items-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
    >
      <Toolbar className="flex items-stretch h-fit">{children}</Toolbar>
    </div>
  )
}
