import { type ServerConfig, Typography } from '@genseki/react'

import { ForgotPasswordClientForm } from './forgot-password.client'

interface ForgotPasswordViewProps {
  serverConfig: ServerConfig
}

export function ForgotPasswordView(props: ForgotPasswordViewProps) {
  return (
    <div className="p-12 md:p-16 flex-1 flex items-center justify-center mx-auto">
      <div className="flex flex-col flex-1 space-y-16 max-w-sm">
        <Typography type="h2" weight="semibold" className="text-center">
          Forgot Password
        </Typography>
        <ForgotPasswordClientForm />
      </div>
    </div>
  )
}
