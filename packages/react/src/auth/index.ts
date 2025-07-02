import * as R from 'remeda'
import type { Simplify } from 'type-fest'

import { type AuthContext, createAuthContext } from './context'
import { createAuthHandlers } from './handlers'

import { getFieldsClient } from '../core/config'
import { type AnyContext, Context, type ContextToRequestContext } from '../core/context'
import type { ApiRouteHandler } from '../core/endpoint'
import type { Fields, FieldsClient } from '../core/field'
import type { AnyTypedColumn, WithAnyTable, WithHasDefault, WithNotNull } from '../core/table'

export type AnyUserTable = WithAnyTable<
  {
    id: WithHasDefault<WithNotNull<AnyTypedColumn<string>>>
    name: WithNotNull<AnyTypedColumn<string>>
    email: WithNotNull<AnyTypedColumn<string>>
    emailVerified: WithNotNull<AnyTypedColumn<boolean>>
    image: AnyTypedColumn<string>
  },
  'user'
>

export type AnySessionTable = WithAnyTable<
  {
    id: WithHasDefault<WithNotNull<AnyTypedColumn<string>>>
    expiresAt: WithNotNull<AnyTypedColumn<Date>>
    token: WithNotNull<AnyTypedColumn<string>>
    ipAddress: AnyTypedColumn<string>
    userAgent: AnyTypedColumn<string>
    userId: WithNotNull<AnyTypedColumn<string>>
  },
  'session'
>

export type AnyAccountTable = WithAnyTable<
  {
    id: WithHasDefault<WithNotNull<AnyTypedColumn<string>>>
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
  },
  'account'
>

export type AnyVerificationTable = WithAnyTable<
  {
    id: WithHasDefault<WithNotNull<AnyTypedColumn<string>>>
    identifier: WithNotNull<AnyTypedColumn<string>>
    value: AnyTypedColumn<string>
    expiresAt: WithNotNull<AnyTypedColumn<Date>>
  },
  'verification'
>

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
  emailAndPassword?: {
    enabled: boolean
    passwordHasher?: (password: string) => Promise<string> // default: scrypt
    signUp?: {
      autoLogin?: boolean // default: true
      additionalFields?: Fields<Record<string, unknown>, AnyContext>
    }
  }
  oauth2?: {
    google?: {
      enabled: boolean
      clientId: string
      clientSecret: string
    }
  }
  resetPassword?: {
    enabled?: boolean // default: false
    expiresInMs?: number // default: 1 day (1000 * 60 * 60 * 24)
    resetPasswordUrl?: string // default: `/auth/reset-password`
    redirectTo?: string // default: `/auth/login`
    sendEmailResetPassword: (email: string, token: string) => Promise<void>
  }
  ui?: {
    login?: {
      strategies?: { style?: string; text: string; href: string }[]
    }
    signUp?: {}
  }
}

type AddObjectKeyPrefix<T extends Record<string, any>, TPrefix extends string> = Simplify<{
  [K in keyof T as K extends string ? `${TPrefix}.${K}` : never]: T[K]
}>

export type Auth<
  TContext extends AnyContext = AnyContext,
  TAuthConfig extends AuthConfig = AuthConfig,
> = {
  config: TAuthConfig
  context: ContextToRequestContext<TContext>
  authContext: AuthContext
  handlers: Simplify<
    AddObjectKeyPrefix<
      ReturnType<typeof createAuthHandlers<any, Context<any, any, any>>>['handlers'],
      'auth'
    >
  >
}

export type AuthHandlers = Auth<any, any>['handlers']

export type AuthClient = {
  login: {
    emailAndPassword: {
      enabled: boolean
    }
  }
  resetPassword: {
    enabled: boolean
    redirectTo: string
  }
  ui: {
    login: {
      strategies: { style?: string; text: string; href: string }[]
    }
    signUp: {
      autoLogin?: boolean
      additionalFields: FieldsClient
    }
  }
}

export function createAuth<const TContext extends AnyContext>(
  config: AuthConfig,
  context: TContext
): Auth<TContext> {
  const authContext = createAuthContext(config, context)
  const { handlers: originalHandlers } = createAuthHandlers(authContext)
  const wrappedContext = Context.toRequestContext(context, { authContext })

  const handlers = R.mapValues(originalHandlers, (h) => {
    const handler: ApiRouteHandler<TContext, any> = (args) => {
      return h.handler({ ...args, context: wrappedContext } as any) as any
    }
    h.handler
    return { schema: h.schema, handler } as any
  }) as ReturnType<typeof createAuthHandlers<typeof authContext, TContext>>['handlers']

  const prefixedHandlers = Object.fromEntries(
    Object.entries(handlers).map(([key, value]) => {
      return [`auth.${key}`, value]
    })
  ) as unknown as AddObjectKeyPrefix<ReturnType<typeof createAuthHandlers>['handlers'], 'auth'>

  return {
    config,
    context: wrappedContext as ContextToRequestContext<TContext>,
    authContext,
    handlers: prefixedHandlers,
  }
}

export function getAuthClient(config: AuthConfig): AuthClient {
  return {
    login: {
      emailAndPassword: {
        enabled: config.emailAndPassword?.enabled ?? false,
      },
    },
    resetPassword: {
      enabled: config.resetPassword?.enabled ?? false,
      redirectTo: config.resetPassword?.redirectTo ?? '/auth/login',
    },
    ui: {
      login: {
        strategies: config.ui?.login?.strategies ?? [],
      },
      signUp: {
        autoLogin: config.emailAndPassword?.signUp?.autoLogin ?? true,
        additionalFields: getFieldsClient(config.emailAndPassword?.signUp?.additionalFields ?? {}),
      },
    },
  }
}
