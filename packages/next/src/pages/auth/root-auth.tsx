import { ServerConfig } from '@kivotos/core'

import { RegisterPage, ResetPasswordConfirmPage } from '~/index'

import { ForgotPasswordPage } from './forgot-password'
import { LoginPage } from './login'

interface RootProps {
  serverConfig: ServerConfig
  segments: string[]
  searchParams: Record<string, string | string[]>
}

/**
 * Path Pattern
 * /auth/sign-in
 * /auth/sign-up
 * /auth/forgot-password
 * /auth/reset-password
 *
 * Fallback
 * 404                          Not Found
 * 400-599                      Server Error
 */
export async function RootAuthPage(props: RootProps) {
  const { serverConfig, segments } = props

  const method = segments[0]

  if (method === 'login') {
    return <LoginPage serverConfig={serverConfig} />
  }

  if (method === 'register') {
    return <RegisterPage serverConfig={serverConfig} />
  }

  if (method === 'forgot-password') {
    return <ForgotPasswordPage serverConfig={serverConfig} />
  }

  if (method === 'reset-password') {
    return <ResetPasswordConfirmPage />
  }

  throw new Error(`Invalid path: ${segments.join('/')}`) // TODO: 404
}
