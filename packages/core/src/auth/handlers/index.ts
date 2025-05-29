import { forgotPasswordEmail } from './forgot-password'
import { loginEmail } from './login-email'
import { me } from './me'
import { resetPasswordEmail } from './reset-password'
import { signOut } from './sign-out'
import { signUp } from './sign-up'

import type { MinimalContext } from '../../config'
import { type AuthContext } from '../context'

export function createAuthHandlers<
  TAuthContext extends AuthContext,
  TContext extends MinimalContext,
>(authContext: TAuthContext) {
  const handlers = {
    //  No authentication required
    signUp: signUp<TAuthContext, TContext>(authContext),
    loginEmail: loginEmail<TAuthContext, TContext>(authContext),
    signOut: signOut<TAuthContext, TContext>(authContext),
    resetPasswordEmail: resetPasswordEmail<TAuthContext, TContext>(authContext),
    forgotPasswordEmail: forgotPasswordEmail<TAuthContext, TContext>(authContext),
    // Authentication required
    me: me<TAuthContext, TContext>(authContext),
  } as const

  return {
    handlers,
  }
}
