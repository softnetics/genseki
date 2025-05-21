import 'server-only'

import { AppSidebarBreadCrumbs } from './app-sidebar-bread-crumbs'
import { UserMenu } from './user-menu'

import { Separator } from '../../../intentui/ui/separator'
import { SidebarNav, SidebarTrigger } from '../../../intentui/ui/sidebar'

export function AppSidebarNav() {
  return (
    <SidebarNav className="relative z-10 h-[76px] border-b pr-12">
      <div className="flex items-center gap-x-4">
        <SidebarTrigger size="sm" variant="ghost" className="-mx-2" />
        <Separator className="h-6" orientation="vertical" />
        <AppSidebarBreadCrumbs />
      </div>
      <UserMenu />
    </SidebarNav>
  )
}
