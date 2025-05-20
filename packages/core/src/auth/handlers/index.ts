import { forgotPasswordEmail } from './forgot-password'
import { me } from './me'
import { resetPasswordEmail } from './reset-password'
import { signInEmail } from './sign-in-email'
import { signOut } from './sign-out'
import { signUp } from './sign-up'

import type { AuthConfig } from '..'

export function createAuthHandlers<TAuthConfig extends AuthConfig>(config: TAuthConfig) {
  const handlers = {
    //  No authentication required
    signUp: signUp({}),
    signInEmail: signInEmail({}),
    signOut: signOut({}),
    resetPasswordEmail: resetPasswordEmail({}),
    forgotPasswordEmail: forgotPasswordEmail({}),
    // Authentication required
    me: me({}),
  }

  return {
    handlers,
  }
}
