'use client'

import React, {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useMemo,
} from 'react'

import { useNavigation } from './navigation'
import { UiProviders } from './ui'

import type { GensekiAppClient, GensekiAppCompiled } from '../../core/config'
import type { FlatApiRouter } from '../../core/endpoint'
import { AppSidebar } from '../components/compound/collection-sidebar'
import { AppTopbarNav } from '../components/compound/collection-sidebar/nav/app-topbar-nav'
import { SidebarInset, SidebarProvider } from '../components/primitives/sidebar'
import { Toast } from '../components/primitives/toast'
import type { ServerFunction } from '../server-function'

interface RootGensekiComponents {
  AppSidebar: React.FC
  AppSidebarProvider: React.FC<PropsWithChildren>
  AppSidebarInset: React.FC<PropsWithChildren>
  AppTopbar: React.FC
}

type RootContextValue<TApp extends GensekiAppCompiled = GensekiAppCompiled> = {
  app: GensekiAppClient
  components: RootGensekiComponents
  serverFunction: ServerFunction<TApp>
}

const GensekiContext = createContext<RootContextValue>(null!)

export function useGenseki() {
  const context = useContext(GensekiContext)
  if (!context) throw new Error('"useGenseki" must be used within a "GensekiProvider"')
  return context as unknown as RootContextValue
}

export function useStorageAdapter() {
  const context = useContext(GensekiContext)
  if (!context) throw new Error('"useStorageAdapter" must be used within a "GensekiProvider"')
  const storageAdapter = context.app?.storageAdapter
  if (!storageAdapter) {
    throw new Error('Storage adapter is not configured in the GensekiCore')
  }
  return storageAdapter
}

export function useServerFunction<
  TApp extends GensekiAppCompiled = GensekiAppCompiled<FlatApiRouter>,
>() {
  const context = useContext(GensekiContext)
  if (!context) throw new Error('"useServerFunction" must be used within a "GensekiProvider"')
  return context.serverFunction as unknown as ServerFunction<TApp>
}

export function GensekiProvider(props: {
  app: GensekiAppClient
  serverFunction: ServerFunction
  children: ReactNode
}) {
  const navigation = useNavigation()

  const pathname = navigation.getPathname()

  const components: RootGensekiComponents = useMemo(
    () => ({
      AppTopbar: () => <AppTopbarNav />,
      AppSidebar: () => (
        <AppSidebar
          pathname={pathname}
          title={props.app.title}
          version={props.app.version}
          sidebar={props.app.sidebar}
        />
      ),
      AppSidebarInset: (props) => <SidebarInset {...props} />,
      AppSidebarProvider: (props) => <SidebarProvider {...props} />,
    }),
    [props.app, pathname]
  )

  return (
    <GensekiContext.Provider
      value={{
        app: props.app,
        serverFunction: props.serverFunction,
        components,
      }}
    >
      <Toast />
      <UiProviders>{props.children}</UiProviders>
    </GensekiContext.Provider>
  )
}
