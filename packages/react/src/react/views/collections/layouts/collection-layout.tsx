import {
  AppSidebar,
  type AppSideBarBuilderProps,
  SidebarInset,
  SidebarProvider,
} from '../../../components'

export interface CollectionLayoutProps {
  title: string
  version: string
  children: React.ReactNode
  pathname: string
  sidebar?: AppSideBarBuilderProps
}

export function CollectionLayout(props: CollectionLayoutProps) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar
          title={props.title}
          version={props.version}
          sidebar={props.sidebar}
          pathname={props.pathname}
        />
        <SidebarInset>{props.children}</SidebarInset>
      </SidebarProvider>
    </>
  )
}
