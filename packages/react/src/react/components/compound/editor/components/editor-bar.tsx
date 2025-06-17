'use client'
import type React from 'react'

import { useCurrentEditor } from '@tiptap/react'

import { cn } from '../../../../utils/cn'
import { Toolbar, ToolbarGroup } from '../../../primitives/toolbar'

export const EditorBarGroup = ToolbarGroup

export const EditorBar: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className,
  children,
}) => {
  const { editor } = useCurrentEditor()

  if (!editor) throw new Error('Editor not found')

  return (
    <div className={cn('overflow-x-auto sticky top-1 m-4 z-10 bg-bg rounded-lg', className)}>
      <Toolbar className="flex items-stretch">{children}</Toolbar>
    </div>
  )
}
