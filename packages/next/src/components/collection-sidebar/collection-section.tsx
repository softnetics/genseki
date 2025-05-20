'use client'
import React from 'react'

import { DatabaseIcon } from '@phosphor-icons/react'

import { Collection } from '@kivotos/core'

import { SidebarItem } from '~/intentui/ui/sidebar'
import {
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarLabel,
} from '~/intentui/ui/sidebar'
import { SidebarDisclosure } from '~/intentui/ui/sidebar'

import BaseIcon from '../primitives/base-icon'

const CurveLine = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="17"
      height="15"
      viewBox="0 0 17 15"
      fill="none"
    >
      <path d="M16 14C2.5 14 1 6.68747 1 1" className="stroke-primary" strokeLinecap="round" />
    </svg>
  )
}

type CollectionSectionProps = {
  collections: Collection[]
}

const CollectionSection = ({ collections }: CollectionSectionProps) => {
  return (
    <SidebarDisclosure id={2}>
      <SidebarDisclosureTrigger className="rounded-md! in-data-[sidebar-state=collapsed]:rounded-none!">
        <BaseIcon icon={DatabaseIcon} size="sm" weight="duotone" className="size-8!" />
        <SidebarLabel className="text-text-body text-sm">Collections</SidebarLabel>
      </SidebarDisclosureTrigger>
      <div className="relative">
        <div
          style={{ '--amount': 3 } as React.CSSProperties}
          className="bg-primary in-data-[sidebar-state=collapsed]:hidden in-data-expanded:block absolute left-[calc(var(--spacing)*7.2)] top-[calc(var(--spacing)*-5)] z-10 hidden h-[calc((41.14px*var(--amount))-21.14px)] w-px"
        />
        <SidebarDisclosurePanel>
          <SidebarItem ghost href="#" tooltip="Tickets" isCurrent>
            <CurveLine className="absolute inset-y-0 left-7 my-auto -translate-y-3" />
            <SidebarLabel className="ml-6">Posts</SidebarLabel>
          </SidebarItem>
          <SidebarItem ghost href="#" tooltip="Tickets">
            <CurveLine className="absolute inset-y-0 left-7 my-auto -translate-y-3" />
            <SidebarLabel className="ml-6">Post categories</SidebarLabel>
          </SidebarItem>
          <SidebarItem ghost href="#" tooltip="Tickets">
            <CurveLine className="absolute inset-y-0 left-7 my-auto -translate-y-3" />
            <SidebarLabel className="ml-6">Users</SidebarLabel>
          </SidebarItem>
        </SidebarDisclosurePanel>
      </div>
    </SidebarDisclosure>
  )
}

export default CollectionSection
