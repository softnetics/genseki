import type { AnyColumn, AnyTable } from 'drizzle-orm'
import * as R from 'remeda'
import type { Simplify } from 'type-fest'

import { type AuthContext, createAuthContext } from './context'
import { createAuthHandlers } from './handlers'

import type { MinimalContext } from '../config'
import type { ApiRouteHandler } from '../endpoint'

export type AnyTypedColumn<T> = AnyColumn & { _: { data: T; dialect: 'pg' } }
export type WithNotNull<T> = T & { _: { notNull: true } }
export type WithAnyTable<TColumns extends Record<string, AnyColumn>> = AnyTable<{
  dialect: 'pg'
  columns: TColumns
}> &
  TColumns

export type AnyUserTable = WithAnyTable<{
  id: WithNotNull<AnyTypedColumn<string>>
  name: WithNotNull<AnyTypedColumn<string>>
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

type ChangeAuthHandlerContextToMinimalContext<
  TContext extends MinimalContext,
  THandlers extends Record<string, { handler: ApiRouteHandler<any, any> }>,
> = {
  [K in keyof THandlers]: THandlers[K]['handler'] extends ApiRouteHandler<
    any,
    infer TApiRouteSchema
  >
    ? { schema: TApiRouteSchema; handler: ApiRouteHandler<TContext, TApiRouteSchema> }
    : never
}

type AddObjectKeyPrefix<T extends Record<string, any>, TPrefix extends string> = Simplify<{
  [K in keyof T as K extends string ? `${TPrefix}.${K}` : never]: T[K]
}>

export type Auth<
  TContext extends MinimalContext = MinimalContext,
  TAuthConfig extends AuthConfig = AuthConfig,
> = {
  config: TAuthConfig
  context: TContext
  authContext: AuthContext
  handlers: Simplify<
    AddObjectKeyPrefix<
      ChangeAuthHandlerContextToMinimalContext<
        TContext,
        ReturnType<typeof createAuthHandlers>['handlers']
      >,
      'auth'
    >
  >
}

export function createAuth<TContext extends MinimalContext<any> = MinimalContext<any>>(
  config: AuthConfig,
  context: TContext
): Auth<TContext> {
  const authContext = createAuthContext(config, context)
  const { handlers: originalHandlers } = createAuthHandlers(config)

  const handlers = R.mapValues(originalHandlers, (h) => {
    const handler: ApiRouteHandler<TContext, any> = (args) => {
      return h.handler({ ...args, context: authContext } as any) as any
    }
    return { schema: h.schema, handler }
  }) as ChangeAuthHandlerContextToMinimalContext<
    TContext,
    ReturnType<typeof createAuthHandlers>['handlers']
  >

  const prefixedHandlers = Object.fromEntries(
    Object.entries(handlers).map(([key, value]) => {
      return [`auth.${key}`, value]
    })
  ) as unknown as AddObjectKeyPrefix<
    ChangeAuthHandlerContextToMinimalContext<
      TContext,
      ReturnType<typeof createAuthHandlers>['handlers']
    >,
    'auth'
  >

  return {
    config,
    context,
    authContext,
    handlers: prefixedHandlers,
  }
}
