import { type ReactNode } from 'react'

import { getClientConfig, RootProvider, type ServerFunction } from '@genseki/react'

import { NextNavigationProvider } from './navigation'

import type { NextJsServerConfig } from '../config'

interface RootLayoutProps {
  serverConfig: NextJsServerConfig<any, any, any, any>
  serverFunction: ServerFunction<NextJsServerConfig<any, any, any, any>>
  children: ReactNode
}

export function RootLayout(props: RootLayoutProps) {
  const clientConfig = getClientConfig(props.serverConfig)
  return (
    <NextNavigationProvider>
      <RootProvider clientConfig={clientConfig} serverFunction={props.serverFunction}>
        {props.children}
      </RootProvider>
    </NextNavigationProvider>
  )
}
