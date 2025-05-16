import { type Collection, type ServerConfig } from '@repo/drizzlify'

import type { ServerFunction } from '~/server-function'

import { RootLayout } from './root'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarLabel,
  SidebarNav,
  SidebarProvider,
  SidebarSection,
  SidebarTrigger,
} from '../intentui/ui/sidebar'
import { formatSlug } from '../utils/format-slug'

interface RootLayoutProps<TServerConfig extends ServerConfig<any, any, any, any>> {
  serverConfig: TServerConfig
  serverFunction: ServerFunction<TServerConfig>
  children: React.ReactNode
}

export function RootCollectionLayout<TServerConfig extends ServerConfig<any, any, any, any>>(
  props: RootLayoutProps<TServerConfig>
) {
  return (
    <RootLayout serverConfig={props.serverConfig} serverFunction={props.serverFunction}>
      <SidebarProvider>
        <AppSidebar collections={props.serverConfig.collections} />
        <SidebarInset>
          <AppSidebarNav />
          <div className="p-4 lg:p-6">{props.children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RootLayout>
  )
}

function AppSidebar(props: { collections: Collection[] }) {
  return (
    <Sidebar>
      <SidebarHeader>Drizzlify</SidebarHeader>
      <SidebarContent>
        <SidebarSection title="Collections">
          {props.collections.map((collection) => (
            <SidebarItem key={collection.slug} href={`/admin/collections/${collection.slug}`}>
              <SidebarLabel>{formatSlug(collection.slug)}</SidebarLabel>
            </SidebarItem>
          ))}
        </SidebarSection>
      </SidebarContent>
    </Sidebar>
  )
}

function AppSidebarNav() {
  return (
    <SidebarNav className="border-b">
      <span className="flex items-center gap-x-4">
        <SidebarTrigger className="-mx-2" />
      </span>
    </SidebarNav>
  )
}
