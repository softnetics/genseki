import { forgotPasswordEmail } from './forgot-password'
import { loginEmail } from './login-email'
import { me } from './me'
import { resetPasswordEmail } from './reset-password'
import { signOut } from './sign-out'
import { signUp } from './sign-up'

import { type AuthContext } from '../context'

export function createAuthHandlers<TAuthContext extends AuthContext>(authContext: TAuthContext) {
  const handlers = {
    //  No authentication required
    signUp: signUp(authContext),
    loginEmail: loginEmail(authContext),
    signOut: signOut(authContext),
    resetPasswordEmail: resetPasswordEmail(authContext),
    forgotPasswordEmail: forgotPasswordEmail(authContext),
    // Authentication required
    me: me(authContext),
  } as const

  return {
    handlers,
  }
}
