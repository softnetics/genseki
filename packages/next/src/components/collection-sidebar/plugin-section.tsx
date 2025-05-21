'use client'
import { Plug } from '@phosphor-icons/react'

import {
  SidebarDisclosure,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarItem,
  SidebarLabel,
} from '../../intentui/ui/sidebar'
import BaseIcon from '../primitives/base-icon'

const PluginSection = () => {
  const plugins = []

  return (
    <SidebarDisclosure id={1} isDisabled={plugins.length === 0}>
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
