import { SignUpClientForm } from './sign-up.client'

import { Typography } from '../../react/components/primitives'

interface SignInViewProps {}

export function SignUpView(props: SignInViewProps) {
  return (
    <div className="p-12 md:p-16 flex-1 flex items-center justify-center mx-auto">
      <div className="flex flex-col flex-1 space-y-16 max-w-sm">
        <div className="flex flex-col flex-1 space-y-12">
          <Typography type="h2" weight="semibold" className="text-center">
            Sign Up
          </Typography>
          <SignUpClientForm />
        </div>
      </div>
    </div>
  )
}
