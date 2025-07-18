import {
  AppSidebar,
  type AppSideBarBuilderProps,
  AppSidebarNav,
  SidebarInset,
  SidebarProvider,
} from '../../../components'

export interface CollectionAppLayoutProps {
  title: string
  version: string
  children: React.ReactNode
  pathname: string
  sidebar?: AppSideBarBuilderProps
}

/**
 * @description RootCollection Layout is included with `sidebar`
 */
export function CollectionAppLayout(props: CollectionAppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar
        title={props.title}
        version={props.version}
        sidebar={props.sidebar}
        pathname={props.pathname}
      />
      <SidebarInset>
        <AppSidebarNav />
        {props.children}
      </SidebarInset>
    </SidebarProvider>
  )
}
