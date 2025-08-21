'use client'

import React, { createContext, type PropsWithChildren, type ReactNode, useContext } from 'react'

import { UiProviders } from './ui'

import type { GensekiAppClient, GensekiAppCompiled } from '../../core/config'
import { SidebarProvider } from '../components/primitives/sidebar'
import { Toast } from '../components/primitives/toast'
import type { ServerFunction } from '../server-function'

type RootContextValue<TApp extends GensekiAppCompiled = GensekiAppCompiled> = {
  app: GensekiAppClient
  components: {
    AppSidebar: React.FC
    AppSidebarInset: React.FC<PropsWithChildren>
    AppTopbar: React.FC
  }
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

export function useServerFunction<TApp extends GensekiAppCompiled = GensekiAppCompiled>() {
  const context = useContext(GensekiContext)
  if (!context) throw new Error('"useServerFunction" must be used within a "GensekiProvider"')
  return context.serverFunction as unknown as ServerFunction<TApp>
}

export const GensekiProvider = (props: {
  app: GensekiAppClient
  serverFunction: ServerFunction
  children: ReactNode
}) => {
  return (
    <GensekiContext.Provider
      value={{
        app: props.app,
        serverFunction: props.serverFunction,
        components: {
          AppTopbar: () => null,
          AppSidebar: () => null,
          AppSidebarInset: () => null,
        },
      }}
    >
      <SidebarProvider>
        <Toast />
        <UiProviders>{props.children}</UiProviders>
      </SidebarProvider>
    </GensekiContext.Provider>
  )
}
