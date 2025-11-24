'use client'

import React from 'react'

import { cn } from '../../../utils/cn'

export interface CollectionListTableContainerProps {
  children?: React.ReactNode
  className?: string
}

export function CollectionListTableContainer(props: CollectionListTableContainerProps) {
  return (
    <div
      className={cn('p-12 max-w-[1200px] mx-auto flex w-full flex-col gap-y-12', props.className)}
    >
      {props.children}
    </div>
  )
}
