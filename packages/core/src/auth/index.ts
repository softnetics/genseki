import { AnyColumn, AnyTable } from 'drizzle-orm'

import { AuthContext, createAuthContext } from './context'
import { createAuthHandlers } from './handlers'

import { MinimalContext } from '../config'

export type AnyTypedColumn<T> = AnyColumn & { _: { data: T; dialect: 'pg' } }
export type WithNotNull<T> = T & { _: { notNull: true } }
export type WithAnyTable<TColumns extends Record<string, AnyColumn>> = AnyTable<{
  dialect: 'pg'
  columns: TColumns
}> &
  TColumns

export type AnyUserTable = WithAnyTable<{
  id: WithNotNull<AnyTypedColumn<string>>
  email: WithNotNull<AnyTypedColumn<string>>
  emailVerified: WithNotNull<AnyTypedColumn<boolean>>
  image: AnyTypedColumn<string>
}>

export type AnyUserTable2 = WithAnyTable<{
  id: WithNotNull<AnyTypedColumn<string>>
  email: WithNotNull<AnyTypedColumn<string>>
  emailVerified: WithNotNull<AnyTypedColumn<boolean>>
  roles: AnyTypedColumn<string[]>
}>

export type AnySessionTable = WithAnyTable<{
  id: WithNotNull<AnyTypedColumn<string>>
  expiresAt: WithNotNull<AnyTypedColumn<Date>>
  token: WithNotNull<AnyTypedColumn<string>>
  ipAddress: AnyTypedColumn<string>
  userAgent: AnyTypedColumn<string>
  userId: WithNotNull<AnyTypedColumn<string>>
}>

export type AnyAccountTable = WithAnyTable<{
  id: WithNotNull<AnyTypedColumn<string>>
  accountId: WithNotNull<AnyTypedColumn<string>>
  providerId: WithNotNull<AnyTypedColumn<string>>
  userId: WithNotNull<AnyTypedColumn<string>>
  accessToken: AnyTypedColumn<string>
  refreshToken: AnyTypedColumn<string>
  idToken: AnyTypedColumn<string>
  accessTokenExpiresAt: AnyTypedColumn<Date>
  refreshTokenExpiresAt: AnyTypedColumn<Date>
  scope: AnyTypedColumn<string>
  password: AnyTypedColumn<string>
}>

export type AnyVerificationTable = WithAnyTable<{
  id: WithNotNull<AnyTypedColumn<string>>
  identifier: WithNotNull<AnyTypedColumn<string>>
  value: AnyTypedColumn<string>
  expiresAt: WithNotNull<AnyTypedColumn<Date>>
}>

export interface AuthConfig {
  secret: string
  user: {
    model: AnyUserTable
  }
  session: {
    model: AnySessionTable
    cookiePrefix?: string
  }
  account: {
    model: AnyAccountTable
  }
  verification: {
    model: AnyVerificationTable
  }
  login?: {
    emailAndPassword?: {
      enabled: boolean
    }
  }
  oauth2?: {
    google?: {
      clientId: string
      clientSecret: string
    }
  }
  resetPassword?: {
    enabled?: boolean // default: false
    expiresInMs?: number // default: 1 day (1000 * 60 * 60 * 24)
    resetPasswordUrl?: string // default: `/auth/reset-password`
    redirectTo?: string // default: `/auth/login`
  }
}

export type Auth<
  TContext extends MinimalContext = MinimalContext,
  TAuthConfig extends AuthConfig = AuthConfig,
> = {
  config: TAuthConfig
  context: TContext
  authContext: AuthContext
  handlers: ReturnType<typeof createAuthHandlers>['handlers']
}

export function createAuth<TContext extends MinimalContext = MinimalContext>(
  config: AuthConfig,
  context: TContext
): Auth<TContext> {
  const authContext = createAuthContext(config, context)
  const { handlers } = createAuthHandlers(config)

  return {
    config,
    context,
    authContext,
    handlers,
  }
}
