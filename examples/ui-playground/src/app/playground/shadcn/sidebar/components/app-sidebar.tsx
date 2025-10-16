import * as React from 'react'

import {
  BookOpenIcon,
  RobotIcon,
  StackIcon,
  TerminalWindowIcon,
  WaveformIcon,
} from '@phosphor-icons/react'

import { Typography } from '@genseki/react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@genseki/react/v2'

import { NavHeader } from './nav-header'
import { NavMain } from './nav-main'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
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
      title: 'Playground',
      url: '#',
      icon: TerminalWindowIcon,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: RobotIcon,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpenIcon,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="w-full bg-muted rounded-md px-6 py-4 text-muted-fg border border-border">
          <Typography>Footer content</Typography>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
