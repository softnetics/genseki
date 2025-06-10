import { createAuth, type ServerConfig, Typography } from '@genseki/react'

import { ResetPasswordClientForm } from './reset-password.client'

interface ResetPasswordViewProps {
  serverConfig: ServerConfig
  searchParams: { [key: string]: string | string[] }
}

export async function ResetPasswordView({ searchParams, serverConfig }: ResetPasswordViewProps) {
  const token = searchParams['token'] as string | undefined

  const { context: authContext } = createAuth(serverConfig.auth, serverConfig.context)

  const validateToken = await serverConfig.endpoints['auth.validateResetToken'].handler({
    body: {
      token: token || '',
    },
    headers: {},
    context: authContext,
  })

  if (!token || !validateToken?.body?.verification) {
    return (
      <div className="p-12 md:p-16 flex-1 flex items-center justify-center mx-auto">
        <div className="flex flex-col flex-1 space-y-16 max-w-sm text-center">
          <Typography type="h2" weight="normal">
            Invalid or expired token
          </Typography>
          <a href="./forgot-password" className="text-primary hover:underline">
            Click here to request a new password reset link
          </a>
        </div>
      </div>
    )
  }

  return <ResetPasswordClientForm token={token} isErrorToken={!validateToken?.body?.verification} />
}
