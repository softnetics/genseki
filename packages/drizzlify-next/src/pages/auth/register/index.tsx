'use server'

import { ServerConfig } from '@repo/drizzlify'

import RegisterRightPanel from './_components/right-panel'
import { setServerConfig } from './server-context'

import LeftPanel from '../_components/left-panel'

interface LoginPageProps {
  serverConfig: ServerConfig
}

export default async function LoginPage({ serverConfig }: LoginPageProps) {
  setServerConfig(serverConfig)

  return (
    <div className="flex min-h-screen">
      <LeftPanel />
      <RegisterRightPanel />
    </div>
  )
}
