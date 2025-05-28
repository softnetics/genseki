import type { ServerConfig } from '@kivotos/core'

import { ResetPasswordClientForm } from './reset-password.client'

import { Typography } from '../../../components/primitives/typography'

interface ResetPasswordViewProps {
  serverConfig: ServerConfig
}

export function ResetPasswordView(_props: ResetPasswordViewProps) {
  return (
    <div className="p-12 md:p-16 flex-1 flex items-center justify-center mx-auto">
      <div className="flex flex-col flex-1 space-y-16 max-w-sm">
        <div className="flex flex-col flex-1 space-y-12">
          <Typography type="h2" weight="semibold" className="text-center">
            Reset Password
          </Typography>
          <ResetPasswordClientForm />
        </div>
      </div>
    </div>
  )
}
