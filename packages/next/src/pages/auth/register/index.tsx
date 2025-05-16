'use server'

import { ServerConfig } from '@kivotos/core'

import { setServerConfig } from './server-context'
import { LeftPanel } from '../_components/left-panel'
import { RegisterRightPanel } from './_components/right-panel'

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
