import type { ServerConfig } from '@kivotos/core'

interface AuthLayoutProps {
  serverConfig: ServerConfig
  children: React.ReactNode
}

export function AuthLayout(props: AuthLayoutProps) {
  return props.children
}
