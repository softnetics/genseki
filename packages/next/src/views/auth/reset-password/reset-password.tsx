import type { ServerConfig } from '@kivotos/core'

import { ResetPasswordClientForm } from './reset-password.client'

interface ResetPasswordViewProps {
  serverConfig: ServerConfig
  searchParams: { [key: string]: string | string[] }
}

export async function ResetPasswordView({ searchParams, serverConfig }: ResetPasswordViewProps) {
  const token = searchParams['token'] as string | undefined

  const validateToken = await serverConfig.endpoints['auth.validateResetToken'].handler({
    body: {
      token: token || '',
    },
    context: {},
  })

  return <ResetPasswordClientForm token={token} isErrorToken={!validateToken?.body?.verification} />
}
