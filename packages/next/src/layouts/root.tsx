import { type ReactNode } from 'react'

import { RootProvider, type ServerFunction } from '@genseki/react'

import { NextNavigationProvider } from './navigation'

import type { NextJsGensekiApp } from '../with'

interface RootLayoutProps {
  app: NextJsGensekiApp
  serverFunction: ServerFunction
  children: ReactNode
}

export function RootLayout(props: RootLayoutProps) {
  const clientApp = props.app.toClient()

  return (
    <NextNavigationProvider>
      <RootProvider app={clientApp} serverFunction={props.serverFunction}>
        {props.children}
      </RootProvider>
    </NextNavigationProvider>
  )
}
