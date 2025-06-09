import type { ServerConfig } from '@genseki/react'

import { AppSidebarNav, SidebarInset, SidebarProvider } from '../../components'

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
      {/* TODO: Why is this missing */}
      {/* <AppSidebar collections={props.serverConfig.collections} /> */}
      <SidebarInset>
        <AppSidebarNav />
        {props.children}
      </SidebarInset>
    </SidebarProvider>
  )
}
