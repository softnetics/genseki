import { forgotPasswordEmail } from './forgot-password'
import { loginEmail } from './login-email'
import { me } from './me'
import { resetPasswordEmail, validateResetToken } from './reset-password'
import { sendEmailResetPassword } from './send-email-reset-password'
import { signOut } from './sign-out'
import { signUpEmail } from './sign-up'

import type { Context } from '../../core/context'
import { type AuthContext } from '../context'

export function createAuthHandlers<TAuthContext extends AuthContext, TContext extends Context>(
  authContext: TAuthContext
) {
  const handlers = {
    //  No authentication required
    signUpEmail: signUpEmail<TAuthContext, TContext>(authContext),
    loginEmail: loginEmail<TAuthContext, TContext>(authContext),
    signOut: signOut<TAuthContext, TContext>(authContext),
    forgotPasswordEmail: forgotPasswordEmail<TAuthContext, TContext>(authContext),
    resetPasswordEmail: resetPasswordEmail<TAuthContext, TContext>(authContext),
    validateResetToken: validateResetToken<TAuthContext, TContext>(authContext),
    sendEmailResetPassword: sendEmailResetPassword<TAuthContext, TContext>(authContext),
    // Authentication required
    me: me<TAuthContext, TContext>(authContext),
  } as const

  return {
    handlers,
  }
}
