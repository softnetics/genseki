import { AppSidebarNav, SidebarInset, SidebarProvider } from '../../../components'

interface RootLayoutProps {
  children: React.ReactNode
}

/**
 * @description RootCollection Layout is included with `sidebar`
 */
export function CollectionAppLayout(props: RootLayoutProps) {
  return (
    <SidebarProvider>
      {/* TODO: Fix sidebar */}
      {/* <AppSidebar collections={props.serverConfig.collections} /> */}
      <SidebarInset>
        <AppSidebarNav />
        {props.children}
      </SidebarInset>
    </SidebarProvider>
  )
}
