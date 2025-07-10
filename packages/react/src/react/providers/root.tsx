'use client'

import { createContext, type ReactNode, useContext } from 'react'

import { UiProviders } from './ui'

import type { StorageAdapterClient } from '../../core'
import { Toast } from '../components/primitives/toast'
import type { ServerFunction } from '../server-function'

type RootContextValue = {
  storageAdapter: StorageAdapterClient
  serverFunction: ServerFunction<TServerConfig>
}

const RootContext = createContext<RootContextValue>(null!)

export const useRootContext = <TServerConfig extends ServerConfig>() => {
  const context = useContext(RootContext)
  if (!context) throw new Error('useRootContext must be used within a RootProvider')
  return context as unknown as RootContextValue<TServerConfig>
}

export const useStorageAdapter = () => {
  const context = useContext(RootContext)
  if (!context) throw new Error('useStorageAdapter must be used within a RootProvider')
  const storageAdapter = context.storageAdapter

  return storageAdapter
}

export const useServerFunction = <TServerConfig extends ServerConfig>() => {
  const context = useContext(RootContext)
  if (!context) throw new Error('useCollectionServerFunctions must be used within a RootProvider')
  return context.serverFunction as unknown as ServerFunction<TServerConfig>
}

export const RootProvider = (props: { serverFunction: ServerFunction; children: ReactNode }) => {
  return (
    <RootContext.Provider
      value={{
        serverFunction: props.serverFunction,
      }}
    >
      <Toast />
      <UiProviders>{props.children}</UiProviders>
    </RootContext.Provider>
  )
}
