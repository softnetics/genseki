'use client'
import { Compass } from '@phosphor-icons/react/dist/ssr'

import { SidebarItem } from '~/intentui/ui/sidebar'
import {
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarLabel,
} from '~/intentui/ui/sidebar'
import { SidebarDisclosure } from '~/intentui/ui/sidebar'

import BaseIcon from '../primitives/base-icon'

const NavigationSection = () => {
  return (
    <SidebarDisclosure id={0}>
      <SidebarDisclosureTrigger className="rounded-md! in-data-[sidebar-state=collapsed]:rounded-none!">
        <BaseIcon icon={Compass} size="sm" weight="duotone" className="size-8!" />
        <SidebarLabel className="text-text-body text-sm">Navigations</SidebarLabel>
      </SidebarDisclosureTrigger>
      <SidebarDisclosurePanel>
        <SidebarItem href="#" tooltip="Tickets" isCurrent>
          <SidebarLabel>Home</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="#" tooltip="Tickets">
          <SidebarLabel>Users</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="#" tooltip="Tickets">
          <SidebarLabel>Bin</SidebarLabel>
        </SidebarItem>
      </SidebarDisclosurePanel>
    </SidebarDisclosure>
  )
}

export default NavigationSection
