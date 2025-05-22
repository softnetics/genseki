import 'server-only'

import type { ServerConfig } from '@kivotos/core'

import { AppSidebar } from '../../components/collection-sidebar'
import { AppSidebarNav } from '../../components/collection-sidebar/nav/app-sidebar-nav'
import { SidebarInset, SidebarProvider } from '../../intentui/ui/sidebar'

interface RootLayoutProps {
  serverConfig: ServerConfig
  children: React.ReactNode
}

/**
 * @description RootCollection Layout is included with `sidebar`
 */
export function CollectionLayout(props: RootLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar collections={props.serverConfig.collections} />
      <SidebarInset>
        <AppSidebarNav />
        {props.children}
      </SidebarInset>
    </SidebarProvider>
  )
}
