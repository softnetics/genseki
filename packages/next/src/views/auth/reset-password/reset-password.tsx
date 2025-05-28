import type { ServerConfig } from '@kivotos/core'

import { ResetPasswordClientForm } from './reset-password.client'

import { Typography } from '../../../components/primitives/typography'

interface ResetPasswordViewProps {
  serverConfig: ServerConfig
  searchParams: { [key: string]: string | string[] }
}

export function ResetPasswordView({ searchParams }: ResetPasswordViewProps) {
  const token = searchParams['token'] as string | undefined

  if (!token) {
    return (
      <div className="p-12 md:p-16 flex-1 flex items-center justify-center mx-auto">
        <Typography type="h2" weight="semibold" className="text-center">
          Invalid or missing token
        </Typography>
      </div>
    )
  }

  return (
    <div className="p-12 md:p-16 flex-1 flex items-center justify-center mx-auto">
      <div className="flex flex-col flex-1 space-y-16 max-w-sm">
        <div className="flex flex-col flex-1 space-y-12">
          <Typography type="h2" weight="semibold" className="text-center">
            Reset Password
          </Typography>
          <ResetPasswordClientForm token={token} />
        </div>
      </div>
    </div>
  )
}
