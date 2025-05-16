'use client'

import {
  IconCommandRegular,
  IconDashboard,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from '@intentui/icons'

import { useTheme } from '~/intentui/theme-provider'

import { Breadcrumbs } from '../../intentui/ui/breadcrumbs'
import { Menu } from '../../intentui/ui/menu'
import { Separator } from '../../intentui/ui/separator'
import { SidebarNav, SidebarTrigger } from '../../intentui/ui/sidebar'
import { Switch } from '../../intentui/ui/switch'

export default function AppSidebarNav() {
  return (
    <SidebarNav className="h-[76px] border-b">
      <span className="flex items-center gap-x-4">
        <SidebarTrigger size="sm" variant="ghost" className="-mx-2" />
        <Separator className="h-6" orientation="vertical" />
        <Breadcrumbs className="hidden md:flex">
          <Breadcrumbs.Item href="/blocks/sidebar/sidebar-01">Dashboard</Breadcrumbs.Item>
          <Breadcrumbs.Item>Newsletter</Breadcrumbs.Item>
        </Breadcrumbs>
      </span>
      <UserMenu />
    </SidebarNav>
  )
}

function UserMenu() {
  const { theme, setTheme } = useTheme()
  return (
    <Menu>
      <Menu.Trigger className="ml-auto md:hidden" aria-label="Open Menu">
        <p>Option</p>
      </Menu.Trigger>
      <Menu.Content placement="bottom" showArrow className="sm:min-w-64">
        <Menu.Section>
          <Menu.Header className="p-4">
            <span className="block">Kurt Cobain</span>
            <span className="text-muted-fg font-normal">@cobain</span>
          </Menu.Header>
        </Menu.Section>
        <Menu.Item href="#dashboard">
          <IconDashboard />
          <Menu.Label>Dashboard</Menu.Label>
        </Menu.Item>
        <Menu.Item href="#settings">
          <IconSettings />
          <Menu.Label>Settings</Menu.Label>
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item>
          <IconCommandRegular />
          <Menu.Label>Command Menu</Menu.Label>
        </Menu.Item>
        <Menu.Item className="[&>[slot=label]+[data-slot=icon]]:bottom-4 [&>[slot=label]+[data-slot=icon]]:right-12">
          {theme === 'dark' ? <IconMoon /> : <IconSun />}
          <Menu.Label>Theme</Menu.Label>
          <span data-slot="icon">
            <Switch
              className="ml-auto"
              isSelected={theme === 'dark'}
              onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            />
          </span>
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item href="#contact-s">
          <Menu.Label>Contact Support</Menu.Label>
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item href="#logout">
          <IconLogout />
          <Menu.Label>Log out</Menu.Label>
        </Menu.Item>
      </Menu.Content>
    </Menu>
  )
}
