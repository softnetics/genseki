import type { ServerConfig } from '../../../core'
import { AppSidebarNav, SidebarInset, SidebarProvider } from '../../components'
import { AppSidebar } from '../../components/compound/collection-sidebar'

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
