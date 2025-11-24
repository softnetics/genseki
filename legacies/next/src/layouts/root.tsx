import { type ReactNode } from 'react'

import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { GensekiProvider, type ServerFunction } from '@genseki/react'

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
    <NuqsAdapter>
      <NextNavigationProvider>
        <GensekiProvider app={clientApp} serverFunction={props.serverFunction}>
          {props.children}
        </GensekiProvider>
      </NextNavigationProvider>
    </NuqsAdapter>
  )
}
