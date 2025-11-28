'use client'
import * as React from 'react'

import {
  ChartLineUpIcon,
  StackIcon,
  StorefrontIcon,
  TerminalWindowIcon,
  TreeStructureIcon,
  WaveformIcon,
} from '@phosphor-icons/react'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@genseki/ui'

import { NavFooter } from './nav-footer'
import { NavHeader } from './nav-header'
import { NavMain } from './nav-main'

// This is sample data.
const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: StackIcon,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: WaveformIcon,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: TerminalWindowIcon,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Omni-Channel Management',
      url: '#',
      icon: TreeStructureIcon,
      isActive: true,
      items: [
        {
          title: 'Bplus Sync',
          url: '#',
        },
        {
          title: 'Product',
          url: '#',
        },
        {
          title: 'Delivery Fee (by Weight)',
          url: '#',
        },
        {
          title: 'Delivery Fee (by Carton)',
          url: '#',
        },
        {
          title: 'Order',
          url: '#',
        },
        {
          title: 'Data export',
          url: '#',
        },
        {
          title: 'Packing',
          url: '#',
        },
        {
          title: 'Inventory',
          url: '#',
        },
        {
          title: 'Inventory transfer',
          url: '#',
        },
      ],
    },
    {
      title: 'Dashboard',
      url: '#',
      icon: ChartLineUpIcon,
      isActive: true,
      items: [
        {
          title: 'User summary',
          url: '#',
        },
        {
          title: 'Sales reports',
          url: '#',
        },
        {
          title: 'Finance overview',
          url: '#',
        },
        {
          title: 'Growth analytics',
          url: '#',
        },
        {
          title: 'Performance metrics',
          url: '#',
        },
        {
          title: 'Engagement insights',
          url: '#',
        },
      ],
    },
    {
      title: 'Storefront Management',
      url: '#',
      icon: StorefrontIcon,
      isActive: true,
      items: [
        {
          title: 'Line shop',
          url: '#',
        },
        {
          title: 'Shopee',
          url: '#',
        },
        {
          title: 'Lazada',
          url: '#',
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="px-6 py-0">
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
