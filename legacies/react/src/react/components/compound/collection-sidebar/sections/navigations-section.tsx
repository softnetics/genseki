'use client'

import { CompassIcon } from '@phosphor-icons/react/dist/ssr'

import {
  SidebarDisclosure,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarItem,
  SidebarLabel,
} from '../../../primitives'
import { BaseIcon } from '../../../primitives/base-icon'

// TODO: Pass pathname as prop
export const NavigationSection = ({ id }: { id: number }) => {
  const pathname = '' as string

  return (
    <SidebarDisclosure id={id}>
      <SidebarDisclosureTrigger className="rounded-md`!` in-data-[sidebar-state=collapsed]:rounded-none!">
        <BaseIcon icon={CompassIcon} size="sm" weight="duotone" className="size-8!" />
        <SidebarLabel className="text-text-primary text-sm">Navigations</SidebarLabel>
      </SidebarDisclosureTrigger>
      <SidebarDisclosurePanel>
        <SidebarItem
          href="/admin/collections"
          tooltip="Tickets"
          isCurrent={pathname === '/admin/collections'}
        >
          <SidebarLabel>Collections</SidebarLabel>
        </SidebarItem>
      </SidebarDisclosurePanel>
    </SidebarDisclosure>
  )
}
