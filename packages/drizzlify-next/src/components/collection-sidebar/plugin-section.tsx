'use client'
import { Plug } from '@phosphor-icons/react'
import { usePathname } from 'next/navigation'

import { SidebarItem } from '~/intentui/ui/sidebar'
import {
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarLabel,
} from '~/intentui/ui/sidebar'
import { SidebarDisclosure } from '~/intentui/ui/sidebar'

import BaseIcon from '../primitives/base-icon'

const PluginSection = () => {
  const pathname = usePathname()

  return (
    <SidebarDisclosure id={1}>
      <SidebarDisclosureTrigger className="rounded-md! in-data-[sidebar-state=collapsed]:rounded-none!">
        <BaseIcon icon={Plug} size="sm" weight="duotone" className="size-8!" />
        <SidebarLabel className="text-text-body text-sm">Plugins</SidebarLabel>
      </SidebarDisclosureTrigger>
      <SidebarDisclosurePanel>
        <SidebarItem href="#" tooltip="Tickets">
          <SidebarLabel>Authentication</SidebarLabel>
        </SidebarItem>
      </SidebarDisclosurePanel>
    </SidebarDisclosure>
  )
}

export default PluginSection
