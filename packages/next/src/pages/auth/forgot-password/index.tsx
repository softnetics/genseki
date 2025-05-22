'use server'

import type { ServerConfig } from '@kivotos/core'

import { ForgotPasswordRightPanel } from './_components/right-panel'
import { setServerConfig } from './server-context'

import { LeftPanel } from '../_components/left-panel'

interface ForgotPasswordPageProps {
  serverConfig: ServerConfig
}

export async function ForgotPasswordPage({ serverConfig }: ForgotPasswordPageProps) {
  setServerConfig(serverConfig)

  return (
    <div className="flex min-h-screen">
      <LeftPanel />
      <ForgotPasswordRightPanel />
    </div>
  )
}
