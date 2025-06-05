import type { ServerConfig } from '@kivotos/core'

import { ResetPasswordClientForm } from './reset-password.client'

interface ResetPasswordViewProps {
  serverConfig: ServerConfig
  searchParams: { [key: string]: string | string[] }
}

export async function ResetPasswordView({ searchParams }: ResetPasswordViewProps) {
  const token = searchParams['token'] as string | undefined

  // const tokenResponse = await serverFunction({
  //   method: 'auth.validateResetToken',
  //   body: {
  //     token: token || '',
  //   },
  // })

  return <ResetPasswordClientForm token={token} />
}
