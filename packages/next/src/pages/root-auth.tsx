import { ServerConfig } from '@kivotos/core'

import { SignInView } from '../views/auth/sign-in'

interface RootProps {
  serverConfig: ServerConfig
  segments: string[]
  searchParams: Record<string, string | string[]>
  headers: Headers
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
  const { serverConfig, segments, searchParams } = props

  const method = segments[0]

  // Handle collection CRUD routes
  if (segments[1] === 'sign-in' && segments.length === 2) {
    return <SignInView serverConfig={serverConfig} />
  }

  // if (segments[1] === 'sign-up' && segments.length === 2) {
  //   return <SignUpView serverConfig={serverConfig} />
  // }

  // if (segments[1] === 'forgot-password' && segments.length === 2) {
  //   return <ForgotPasswordView serverConfig={serverConfig} />
  // }

  // if (segments[1] === 'reset-password' && segments.length === 2) {
  //   return <ResetPasswordView serverConfig={serverConfig} />
  // }

  throw new Error(`Invalid path: ${segments.join('/')}`) // TODO: 404
}
