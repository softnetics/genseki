import './tailwind.css'

import { RootLayout } from '@repo/drizzlify-next'

import { serverConfig } from '~/drizzlify/config'

import { serverFunction } from '../_helper/server'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout serverConfig={serverConfig} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
