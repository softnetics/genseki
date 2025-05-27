import { forgotPasswordEmail } from './forgot-password'
import { loginEmail } from './login-email'
import { me } from './me'
import { resetPasswordEmail } from './reset-password'
import { signOut } from './sign-out'
import { signUp } from './sign-up'

import type { AuthConfig } from '..'

export function createAuthHandlers<TAuthConfig extends AuthConfig>(config: TAuthConfig) {
  const handlers = {
    //  No authentication required
    signUp: signUp({
      autoLogin: config.emailAndPassword?.signUp?.autoLogin ?? true,
    }),
    loginEmail: loginEmail({}),
    signOut: signOut({}),
    resetPasswordEmail: resetPasswordEmail({}),
    forgotPasswordEmail: forgotPasswordEmail({}),
    // Authentication required
    me: me({}),
  } as const

  return {
    handlers,
  }
}

export type AuthHandlers = ReturnType<typeof createAuthHandlers>['handlers']
