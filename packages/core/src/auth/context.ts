import type { AnyTable, Column } from 'drizzle-orm'
import { and, asc, desc, eq } from 'drizzle-orm'
import type { UndefinedToOptional } from 'type-fest/source/internal'

import type { AnyAccountTable, AnySessionTable, AnyUserTable, AuthConfig } from '.'
import { AccountProvider } from './constant'
import { getSessionCookie } from './utils'

import type { MinimalContext } from '../config'

type InferTableType<T extends AnyTable<{}>> = UndefinedToOptional<{
  [K in keyof T['_']['columns']]: T['_']['columns'][K]['_']['notNull'] extends true
    ? T['_']['columns'][K]['_']['data']
    : T['_']['columns'][K]['_']['data'] | null | undefined
}>

type Pagination<TField extends string = string> = {
  page?: number // default 1
  pageSize?: number // default 10
  sort?: {
    field: TField
    order: 'asc' | 'desc'
  }[]
}

export type AuthContext<TConfig extends AuthConfig = AuthConfig> = {
  authConfig: TConfig
  internalHandlers: InternalHandlers

  requiredAuthenticated: (headers?: Record<string, string>) => Promise<InferTableType<AnyUserTable>>
}

export function createAuthContext<TAuthConfig extends AuthConfig, TContext extends MinimalContext>(
  authConfig: TAuthConfig,
  context: TContext
): AuthContext<TAuthConfig> {
  const internalHandlers = createInternalHandlers(authConfig, context)

  return {
    authConfig: authConfig,
    internalHandlers: internalHandlers,

    requiredAuthenticated: async (headers?: Record<string, string>) => {
      const sessionId = getSessionCookie(headers)
      if (!sessionId) throw new Error('Unauthorized')
      const session = await internalHandlers.session.findUserBySessionId(sessionId)
      if (!session) throw new Error('Unauthorized')
      if (session.expiresAt < new Date()) {
        await internalHandlers.session.deleteById(session.id)
        throw new Error('Session expired')
      }
      return {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        emailVerified: session.user.emailVerified,
      }
    },
  }
}

function createInternalHandlers<TAuthConfig extends AuthConfig>(
  config: TAuthConfig,
  context: MinimalContext
) {
  const user = {
    findById: async (id: string) => {
      const table = config.user.model
      const users = await context.db.select().from(table).where(eq(table.id, id))
      if (users.length === 0) throw new Error('User not found')
      if (users.length > 1) throw new Error('Multiple users found')
      const user = users[0]
      return user
    },
    findByEmail: async (email: string) => {
      const table = config.user.model
      const users = await context.db.select().from(table).where(eq(table.email, email))
      if (users.length === 0) throw new Error('User not found')
      if (users.length > 1) throw new Error('Multiple users found')
      const user = users[0]
      return user
    },
    list: async (pagination: Pagination<keyof AnyUserTable['_']['columns']>) => {
      const { page = 1, pageSize = 10, sort } = pagination
      const table = config.user.model
      const users = await context.db
        .select()
        .from(table)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .orderBy(
          ...(sort?.map((s) => {
            const column = table[s.field as keyof typeof table] as Column
            return s.order === 'asc' ? asc(column) : desc(column)
          }) ?? [])
        )
      return users
    },
    create: async (data: Omit<InferTableType<AnyUserTable>, 'id' | 'emailVerified'>) => {
      const table = config.user.model
      const user = await context.db.insert(table).values(data).returning()
      return user[0]
    },
  }
  const account = {
    link: async (data: Omit<InferTableType<AnyAccountTable>, 'id' | 'emailVerified'>) => {
      const table = config.account.model
      const user = await context.db.insert(table).values(data).returning()
      return user[0]
    },
    updatePassword: async (userId: string, password: string) => {
      const table = config.account.model
      const account = await context.db
        .update(table)
        .set({ password })
        .where(and(eq(table.userId, userId), eq(table.providerId, AccountProvider.CREDENTIAL)))
        .returning()
      if (account.length === 0) throw new Error('Account not found')
      if (account.length > 1) throw new Error('Multiple accounts found')
      return account[0]
    },
    findByUserEmailAndProvider: async (email: string, providerId: AccountProvider) => {
      const accounts = await context.db
        .select()
        .from(config.account.model)
        .leftJoin(config.user.model, eq(config.account.model.userId, config.user.model.id))
        .where(
          and(eq(config.user.model.email, email), eq(config.account.model.providerId, providerId))
        )
      if (accounts.length === 0) throw new Error('Account not found')
      if (accounts.length > 1) throw new Error('Multiple accounts found')
      return accounts[0] as unknown as InferTableType<AnyAccountTable> & {
        user: InferTableType<AnyUserTable>
      }
    },
  }
  const session = {
    create: async (data: { userId: string; expiresAt: Date }) => {
      const table = config.session.model
      // TODO: Create token
      const token = crypto.randomUUID()
      const session = await context.db
        .insert(table)
        .values({ ...data, token })
        .returning()
      return session[0]
    },
    update: async (id: string, data: any) => {
      const table = config.session.model
      const session = await context.db.update(table).set(data).where(eq(table.id, id)).returning()
      return session[0]
    },
    findUserBySessionId: async (id: string) => {
      const sessions = await context.db
        .select()
        .from(config.session.model)
        .leftJoin(config.user.model, eq(config.session.model.userId, config.user.model.id))
        .where(eq(config.session.model.id, id))
      if (sessions.length === 0) throw new Error('Session not found')
      if (sessions.length > 1) throw new Error('Multiple sessions found')
      const session = sessions[0]
      return session as unknown as InferTableType<AnySessionTable> & {
        user: InferTableType<AnyUserTable>
      }
    },
    deleteById: async (id: string) => {
      const table = config.session.model
      const session = await context.db.delete(table).where(eq(table.id, id)).returning()
      return session[0]
    },
    deleteByToken: async (token: string) => {
      const table = config.session.model
      const session = await context.db.delete(table).where(eq(table.token, token)).returning()
      return session[0]
    },
    deleteByUserId: async (userId: string) => {
      const table = config.session.model
      const session = await context.db.delete(table).where(eq(table.userId, userId)).returning()
      return session[0]
    },
  }

  const verification = {
    create: async (data: { identifier: string; value: string; expiresAt: Date }) => {
      const table = config.verification.model
      const verification = await context.db.insert(table).values(data).returning()
      return verification[0]
    },
    findByIdentifier: async (identifier: string) => {
      const table = config.verification.model
      const verifications = await context.db
        .select()
        .from(table)
        .where(eq(table.identifier, identifier))
      if (verifications.length === 0) throw new Error('Verification not found')
      if (verifications.length > 1) throw new Error('Multiple verifications found')
      return verifications[0]
    },
  }

  return {
    user,
    account,
    session,
    verification,
  }
}

type InternalHandlers = ReturnType<typeof createInternalHandlers>
