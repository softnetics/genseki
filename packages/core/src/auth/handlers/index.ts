import { loginEmail } from './login-email'
import { me } from './me'
import { resetPasswordEmail, validateResetToken } from './reset-password'
import { sendEmailResetPassword } from './send-email-reset-password'
import { signOut } from './sign-out'
import { signUp } from './sign-up'

import type { AuthConfig } from '..'

export function createAuthHandlers<TAuthConfig extends AuthConfig>(config: TAuthConfig) {
  const handlers = {
    //  No authentication required
    signUp: signUp(config),
    loginEmail: loginEmail(config),
    signOut: signOut({}),
    resetPasswordEmail: resetPasswordEmail({}),
    sendEmailResetPassword: sendEmailResetPassword({}),
    validateResetToken: validateResetToken({}),
    // Authentication required
    me: me({}),
  } as const

  return {
    handlers,
  }
}
