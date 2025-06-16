'use client'

import { createContext, type ReactNode, useContext } from 'react'

import type { ClientConfig, Collection, ServerConfig } from '@genseki/react'

import { UiProviders } from './ui'

import { Toast } from '../components/primitives/toast'
import type { ServerFunction } from '../server-function'

type RootContextValue<TServerConfig extends ServerConfig = ServerConfig> = {
  clientConfig: ClientConfig
  serverFunction: ServerFunction<TServerConfig>
}

const RootContext = createContext<RootContextValue>(null!)

export const useRootContext = <TServerConfig extends ServerConfig>() => {
  const context = useContext(RootContext)
  if (!context) throw new Error('useRootContext must be used within a RootProvider')
  return context as unknown as RootContextValue<TServerConfig>
}

export const useCollection = <TCollection extends Collection>(slug: string) => {
  const context = useContext(RootContext)
  if (!context) throw new Error('useCollection must be used within a RootProvider')
  const collection = context.clientConfig.collections[slug] as TCollection | undefined

  if (!collection) throw new Error(`Collection ${slug} not found`)
  return collection as TCollection
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
  clientConfig: ClientConfig
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
