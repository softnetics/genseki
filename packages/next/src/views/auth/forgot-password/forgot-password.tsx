import type { ServerConfig } from '@kivotos/core'

import { ForgotPasswordClientForm } from './forgot-password.client'

import { Typography } from '../../../components/primitives/typography'

interface SignInViewProps {
  serverConfig: ServerConfig
}

export function ForgotPasswordView(_props: SignInViewProps) {
  return (
    <div className="p-12 md:p-16 flex-1 flex items-center justify-center mx-auto">
      <div className="flex flex-col flex-1 space-y-16 max-w-sm">
        <div className="flex flex-col flex-1 space-y-12">
          <Typography type="h2" weight="semibold" className="text-center">
            ForgotPassword
          </Typography>
          <ForgotPasswordClientForm />
        </div>
      </div>
    </div>
  )
}
