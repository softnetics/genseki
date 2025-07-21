import './tailwind.css'

import { RootLayout } from '@genseki/next'

import { nextjsApp } from '../../../../genseki/config'
import { serverFunction } from '../_helper/server'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout app={nextjsApp} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
