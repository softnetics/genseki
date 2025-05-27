'use client'
import React from 'react'

import { DatabaseIcon } from '@phosphor-icons/react'
import { usePathname } from 'next/navigation'

import {
  SidebarDisclosure,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarItem,
  SidebarLabel,
} from '../../../intentui/ui/sidebar'
import { formatSlug } from '../../../utils/format-slug'
import { BaseIcon } from '../../primitives/base-icon'

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

export const CollectionSection = ({ id, slugs }: { id: number; slugs: string[] }) => {
  const pathname = usePathname()

  const isCurrentPage = (slug: string) => pathname === `/admin/collections/${slug}`

  const collectionHref = (slug: string) => `/admin/collections/${slug}`

  return (
    <SidebarDisclosure id={id}>
      <SidebarDisclosureTrigger className="in-data-[sidebar-state=collapsed]:rounded-none rounded-md">
        <BaseIcon icon={DatabaseIcon} size="sm" weight="duotone" className="size-8!" />
        <SidebarLabel className="text-text-body text-sm">Collections</SidebarLabel>
      </SidebarDisclosureTrigger>
      <div className="relative">
        <div
          style={{ '--amount': slugs.length } as React.CSSProperties}
          className="bg-primary in-data-[sidebar-state=collapsed]:hidden in-data-expanded:block absolute left-[calc(var(--spacing)*7.2)] top-[calc(var(--spacing)*-5)] z-10 hidden h-[calc((41.14px*var(--amount))-21.14px)] w-px"
        />
        <SidebarDisclosurePanel>
          {slugs.map((slug) => (
            <SidebarItem
              key={slug}
              ghost
              isCurrent={isCurrentPage(slug)}
              href={collectionHref(slug)}
              tooltip="Tickets"
            >
              <CurveLine className="absolute inset-y-0 left-7 my-auto -translate-y-3" />
              <SidebarLabel className="ml-6">{formatSlug(slug)}</SidebarLabel>
            </SidebarItem>
          ))}
        </SidebarDisclosurePanel>
      </div>
    </SidebarDisclosure>
  )
}
