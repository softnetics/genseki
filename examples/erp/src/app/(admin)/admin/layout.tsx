import './tailwind.css'

import { RootLayout } from '@kivotos/next'

import { serverConfig } from '~/drizzlify/config'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout serverConfig={serverConfig}>{children}</RootLayout>
}
