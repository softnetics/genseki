'use client'
import { IconCommandRegular, IconDashboard, IconLogout, IconSettings } from '@intentui/icons'
import { DotsThreeIcon } from '@phosphor-icons/react/dist/ssr'

import {
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuLabel,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from '../../../intentui/ui/menu'
import { BaseIcon } from '../../primitives/base-icon'

export function UserMenu() {
  return (
    <Menu>
      <MenuTrigger className="ml-auto" aria-label="Open Menu">
        <BaseIcon icon={DotsThreeIcon} size="md" weight="bold" />
      </MenuTrigger>
      <MenuContent placement="bottom" showArrow className="sm:min-w-64">
        <MenuSection className="mb-1">
          <MenuHeader className="p-4">
            <span className="block">Kurt Cobain</span>
            <span className="text-muted-fg font-normal">@cobain</span>
          </MenuHeader>
        </MenuSection>
        <MenuItem href="#dashboard">
          <IconDashboard />
          <MenuLabel>Dashboard</MenuLabel>
        </MenuItem>
        <MenuItem href="#settings">
          <IconSettings />
          <MenuLabel>Settings</MenuLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem>
          <IconCommandRegular />
          <MenuLabel>Command Menu</MenuLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem href="#contact-s">
          <MenuLabel>Contact Support</MenuLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem href="#logout">
          <IconLogout />
          <MenuLabel>Log out</MenuLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
