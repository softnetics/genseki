import { type ReactNode } from 'react'

import { getClientConfig } from '@kivotos/core'

import type { NextJsServerConfig } from '../config'
import { UiProviders } from '../intentui/providers'
import { RootProvider } from '../providers/root'
import type { ServerFunction } from '../server-function'

interface RootLayoutProps {
  serverConfig: NextJsServerConfig<any, any, any, any>
  serverFunction: ServerFunction<NextJsServerConfig<any, any, any, any>>
  children: ReactNode
}

export function RootLayout(props: RootLayoutProps) {
  const clientConfig = getClientConfig(props.serverConfig)
  return (
    <RootProvider clientConfig={clientConfig} serverFunction={props.serverFunction}>
      <UiProviders>{props.children}</UiProviders>
    </RootProvider>
  )
}
