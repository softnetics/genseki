'use server'

import type { ServerConfig } from '@kivotos/core'

import { RegisterRightPanel } from './_components/right-panel'
import { setServerConfig } from './server-context'

import { LeftPanel } from '../_components/left-panel'

interface LoginPageProps {
  serverConfig: ServerConfig
}

export async function RegisterPage({ serverConfig }: LoginPageProps) {
  setServerConfig(serverConfig)

  return (
    <div className="flex min-h-screen">
      <LeftPanel />
      <RegisterRightPanel />
    </div>
  )
}
