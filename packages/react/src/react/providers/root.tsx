'use client'

import { createContext, type ReactNode, useContext } from 'react'

import { UiProviders } from './ui'

import type {
  ClientApiRouter,
  ClientCollection,
  ClientConfig,
  DefaultCollection,
  ServerConfig,
} from '../../core'
import { Toast } from '../components/primitives/toast'
import type { ServerFunction } from '../server-function'

type RootContextValue<TServerConfig extends ServerConfig = ServerConfig> = {
  clientConfig: ClientConfig<
    Record<string, ClientCollection<any, any, any, any, any, any>>,
    ClientApiRouter
  >
  serverFunction: ServerFunction<TServerConfig>
}

const RootContext = createContext<RootContextValue>(null!)

export const useRootContext = <TServerConfig extends ServerConfig>() => {
  const context = useContext(RootContext)
  if (!context) throw new Error('useRootContext must be used within a RootProvider')
  return context as unknown as RootContextValue<TServerConfig>
}

export const useCollection = <TCollection extends DefaultCollection>(slug: string) => {
  const context = useContext(RootContext)
  if (!context) throw new Error('useCollection must be used within a RootProvider')
  const collection = context.clientConfig.collections[slug] as TCollection | undefined

  if (!collection) throw new Error(`Collection ${slug} not found`)
  return collection as TCollection
}

export const useStorageAdapter = () => {
  const context = useContext(RootContext)
  if (!context) throw new Error('useStorageAdapter must be used within a RootProvider')
  const storageAdapter = context.clientConfig.storageAdapter

  return storageAdapter
}

export const useClientConfig = () => {
  const context = useContext(RootContext)
  if (!context) throw new Error('useClientConfig must be used within a RootProvider')
  return context.clientConfig
}

export const useServerFunction = <TServerConfig extends ServerConfig>() => {
  const context = useContext(RootContext)
  if (!context) throw new Error('useCollectionServerFunctions must be used within a RootProvider')
  return context.serverFunction as unknown as ServerFunction<TServerConfig>
}

export const RootProvider = (props: {
  clientConfig: ClientConfig<
    Record<string, ClientCollection<any, any, any, any, any, any>>,
    ClientApiRouter
  >
  serverFunction: ServerFunction
  children: ReactNode
}) => {
  return (
    <RootContext.Provider
      value={{
        clientConfig: props.clientConfig,
        serverFunction: props.serverFunction,
      }}
    >
      <Toast />
      <UiProviders>{props.children}</UiProviders>
    </RootContext.Provider>
  )
}
