'use client'

import {
  IconCommandRegular,
  IconDashboard,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from '@intentui/icons'
import { CubeIcon, DotsThreeIcon } from '@phosphor-icons/react'
import { usePathname } from 'next/navigation'

import { useTheme } from '~/intentui/theme-provider'
import { useRootContext } from '~/providers/root'
import { formatSlug } from '~/utils/format-slug'

import { Breadcrumbs } from '../../intentui/ui/breadcrumbs'
import { Menu } from '../../intentui/ui/menu'
import { Separator } from '../../intentui/ui/separator'
import { SidebarNav, SidebarTrigger } from '../../intentui/ui/sidebar'
import { Switch } from '../../intentui/ui/switch'
import BaseIcon from '../primitives/base-icon'

const BreadCrumbs = () => {
  const pathname = usePathname()
  const leadingPath = '/admin'

  const removeLeadingpath = pathname.split(leadingPath)[1]

  const sanitizedSegments = removeLeadingpath.slice(1).split('/')

  return (
    <Breadcrumbs separator="slash" className="hidden md:flex">
      {sanitizedSegments.map((segment, index) => {
        return (
          <Breadcrumbs.Item
            key={segment}
            href={`${leadingPath}/${sanitizedSegments.slice(0, index + 1).join('/')}`}
            trailing={
              sanitizedSegments[0] === 'collections' && index === 1 ? <CollectionMenu /> : null
            }
          >
            {segment ?? 'unknown'}
          </Breadcrumbs.Item>
        )
      })}
    </Breadcrumbs>
  )
}

export default function AppSidebarNav() {
  return (
    <SidebarNav className="relative z-10 h-[76px] border-b">
      <span className="flex items-center gap-x-4">
        <SidebarTrigger size="sm" variant="ghost" className="-mx-2" />
        <Separator className="h-6" orientation="vertical" />
        <BreadCrumbs />
      </span>
      <UserMenu />
    </SidebarNav>
  )
}

function CollectionMenu() {
  const { clientConfig } = useRootContext()

  return (
    <Menu>
      <Menu.Trigger className="ml-auto" aria-label="Open Menu">
        <BaseIcon icon={DotsThreeIcon} size="md" weight="bold" />
      </Menu.Trigger>
      <Menu.Content placement="bottom left" showArrow className="sm:min-w-64">
        {clientConfig.collections.map((collection) => (
          <Menu.Item key={collection.slug} href={`/admin/collections/${collection.slug}`}>
            <BaseIcon icon={CubeIcon} weight="duotone" />
            <Menu.Label>{formatSlug(collection.slug)}</Menu.Label>
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu>
  )
}

function UserMenu() {
  const { theme, setTheme } = useTheme()
  return (
    <Menu>
      <Menu.Trigger className="ml-auto" aria-label="Open Menu">
        <BaseIcon icon={DotsThreeIcon} size="md" weight="bold" />
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
