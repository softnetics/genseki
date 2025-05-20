import 'server-only'

import { type ServerConfig } from '@kivotos/core'

import AppSidebar from '~/components/collection-sidebar/app-sidebar'
import AppSidebarNav from '~/components/collection-sidebar/app-sidebar-nav'
import { SidebarInset, SidebarProvider } from '~/intentui/ui/sidebar'

interface RootLayoutProps<TServerConfig extends ServerConfig<any, any, any, any>> {
  serverConfig: TServerConfig
  children: React.ReactNode
}

/**
 * @description RootCollection Layout is included with `sidebar`
 */
export function RootCollectionLayout<TServerConfig extends ServerConfig<any, any, any, any>>(
  props: RootLayoutProps<TServerConfig>
) {
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
