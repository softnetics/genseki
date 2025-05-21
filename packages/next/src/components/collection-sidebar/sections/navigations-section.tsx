'use client'
import { CompassIcon } from '@phosphor-icons/react/dist/ssr'
import { usePathname } from 'next/navigation'

import {
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarLabel,
} from '../../../intentui/ui/sidebar'
import { SidebarDisclosure } from '../../../intentui/ui/sidebar'
import { SidebarItem } from '../../../intentui/ui/sidebar'
import { BaseIcon } from '../../primitives/base-icon'

export const NavigationSection = ({ id }: { id: number }) => {
  const pathname = usePathname()

  return (
    <SidebarDisclosure id={id}>
      <SidebarDisclosureTrigger className="rounded-md`!` in-data-[sidebar-state=collapsed]:rounded-none!">
        <BaseIcon icon={CompassIcon} size="sm" weight="duotone" className="size-8!" />
        <SidebarLabel className="text-text-body text-sm">Navigations</SidebarLabel>
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
