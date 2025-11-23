'use client'
import { PlugIcon } from '@phosphor-icons/react'

import {
  SidebarDisclosure,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarItem,
  SidebarLabel,
} from '../../../primitives'
import { BaseIcon } from '../../../primitives/base-icon'

export const PluginSection = ({ id }: { id: number }) => {
  const plugins = []

  return (
    <SidebarDisclosure id={id} isDisabled={plugins.length === 0}>
      <SidebarDisclosureTrigger className="rounded-md! in-data-[sidebar-state=collapsed]:rounded-none!">
        <BaseIcon icon={PlugIcon} size="sm" weight="duotone" className="size-8!" />
        <SidebarLabel className="text-text-primary text-sm">Plugins</SidebarLabel>
      </SidebarDisclosureTrigger>
      <SidebarDisclosurePanel>
        <SidebarItem href="#" tooltip="Tickets">
          <SidebarLabel>Authentication</SidebarLabel>
        </SidebarItem>
      </SidebarDisclosurePanel>
    </SidebarDisclosure>
  )
}
