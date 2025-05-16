'use server'

import { ServerConfig } from '@kivotos/core'

import RightPanel from './_components/right-panel'
import { signInAction } from './action'
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
      <RightPanel action={signInAction} />
    </div>
  )
}
