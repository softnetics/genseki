import { AppSidebarBreadCrumbs } from './app-sidebar-bread-crumbs'

import { AriaSeparator, SidebarNav, SidebarTrigger } from '../../../primitives'

export function AppTopbarNav() {
  return (
    <SidebarNav className="relative z-10 h-[76px] border-b pr-12">
      <div className="flex items-center gap-x-4">
        <SidebarTrigger size="sm" variant="ghost" className="-mx-2" />
        <AriaSeparator className="h-6" orientation="vertical" />
        <AppSidebarBreadCrumbs />
      </div>
    </SidebarNav>
  )
}
