import { type ReactNode } from 'react'

import { getClientConfig, type ServerConfig } from '@kivotos/core'

import { UiProviders } from '../intentui/providers'
import { RootProvider } from '../providers/root'
import type { ServerFunction } from '../server-function'

interface RootLayoutProps<TServerConfig extends ServerConfig<any, any, any, any>> {
  serverConfig: TServerConfig
  serverFunction: ServerFunction<TServerConfig>
  children: ReactNode
}

export function RootLayout<TServerConfig extends ServerConfig<any, any, any, any>>(
  props: RootLayoutProps<TServerConfig>
) {
  const clientConfig = getClientConfig(props.serverConfig)

  return (
    <RootProvider clientConfig={clientConfig} serverFunction={props.serverFunction}>
      <UiProviders>{props.children}</UiProviders>
    </RootProvider>
  )
}
