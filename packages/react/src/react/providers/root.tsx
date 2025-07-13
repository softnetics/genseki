'use client'

import { createContext, type ReactNode, useContext } from 'react'

import { UiProviders } from './ui'

import type { GensekiCore } from '../../core/config'
import { Toast } from '../components/primitives/toast'
import type { ServerFunction } from '../server-function'

type RootContextValue<TGensekiCore extends GensekiCore = GensekiCore> = {
  app: GensekiCore['app']
  serverFunction: ServerFunction<TGensekiCore>
}

const RootContext = createContext<RootContextValue>(null!)

export const useRootContext = <TGensekiCore extends GensekiCore>() => {
  const context = useContext(RootContext)
  if (!context) throw new Error('useRootContext must be used within a RootProvider')
  return context as unknown as RootContextValue<TGensekiCore>
}

export const useStorageAdapter = () => {
  const context = useContext(RootContext)
  if (!context) throw new Error('useStorageAdapter must be used within a RootProvider')
  const storageAdapter = context.app?.storageAdapter
  if (!storageAdapter) {
    throw new Error('Storage adapter is not configured in the GensekiCore')
  }
  return storageAdapter
}

export const useServerFunction = <TGensekiCore extends GensekiCore>() => {
  const context = useContext(RootContext)
  if (!context) throw new Error('useCollectionServerFunctions must be used within a RootProvider')
  return context.serverFunction as unknown as ServerFunction<TGensekiCore>
}

export const RootProvider = (props: {
  app: GensekiCore['app']
  serverFunction: ServerFunction
  children: ReactNode
}) => {
  return (
    <RootContext.Provider value={{ app: props.app, serverFunction: props.serverFunction }}>
      <Toast />
      <UiProviders>{props.children}</UiProviders>
    </RootContext.Provider>
  )
}
