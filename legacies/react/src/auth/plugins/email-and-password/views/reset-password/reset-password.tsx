import { Typography } from '@genseki/react/v2'

import { ResetPasswordClientForm } from './reset-password.client'

interface ResetPasswordViewProps {
  validateToken(token: string): Promise<boolean>
  searchParams: { [key: string]: string | string[] }
}

const ErrorView = () => (
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

export async function ResetPasswordView(props: ResetPasswordViewProps) {
  const token = props.searchParams['token'] as string | undefined

  if (typeof token !== 'string') {
    return <ErrorView />
  }

  const validation = await props.validateToken(token)

  if (!validation) {
    return <ErrorView />
  }

  return <ResetPasswordClientForm token={token} />
}
