import './tailwind.css'

import { RootLayout } from '@genseki/next'

import { serverConfig } from '../../../../drizzlify/config'
import { serverFunction } from '../_helper/server'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout serverConfig={serverConfig} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
