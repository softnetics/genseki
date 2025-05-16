import { type ServerConfig } from '@repo/drizzlify'

import AppSidebar from '~/components/collection-sidebar/app-sidebar'
import AppSidebarNav from '~/components/collection-sidebar/app-sidebar-nav'
import { SidebarInset, SidebarProvider } from '~/intentui/ui/sidebar'
import type { ServerFunction } from '~/server-function'

import { RootLayout } from './root'

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
      {props.children}
    </RootLayout>
  )
  return (
    <RootLayout serverConfig={props.serverConfig} serverFunction={props.serverFunction}>
      <SidebarProvider className="">
        <AppSidebar collections={props.serverConfig.collections} />
        <SidebarInset>
          <AppSidebarNav />
          <div className="h-[200vh] p-4 lg:p-6">
            <div className="bg-accent h-[20rem] w-full" />
            <div className="bg-accent mt-4 h-[1rem] w-full" />
            <div className="bg-accent mt-2 h-[1rem] w-full" />
            <div className="bg-accent mt-2 h-[1rem] w-full" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RootLayout>
  )
}
