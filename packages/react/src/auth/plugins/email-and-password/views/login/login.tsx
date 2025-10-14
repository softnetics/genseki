import { LoginClientForm } from './login.client'

import { Button } from '../../../../../react/components/primitives/button'
import { Typography } from '../../../../../react/components/primitives/typography'

interface LoginViewProps {}

export function LoginView(props: LoginViewProps) {
  return (
    <div className="p-12 md:p-16 flex-1 flex items-center justify-center mx-auto">
      <div className="flex flex-col flex-1 space-y-16 max-w-sm">
        <div className="flex flex-col flex-1 space-y-12">
          <Typography type="h2" weight="semibold" className="text-center">
            Welcome back
          </Typography>
          <LoginClientForm />
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="flex w-full border-b" />
          <span className="text-muted-foreground text-nowrap text-xs text-center">
            OR CONTINUE WITH
          </span>
          <div className="flex w-full border-b" />
        </div>
        <Button asChild variant="outline">
          <a href=".">TODO: Google</a>
        </Button>
      </div>
    </div>
  )
}
