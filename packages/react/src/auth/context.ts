import type { AnyTable, Column } from 'drizzle-orm'
import { and, asc, desc, eq, like } from 'drizzle-orm'
import type { UndefinedToOptional } from 'type-fest/source/internal'

import type { AnyAccountTable, AnySessionTable, AnyUserTable, AuthOptions } from '.'
import { AccountProvider } from './constant'

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

export function createAuthInternalHandler(options: AuthOptions) {
  const db = options.db

  const user = {
    findById: async (id: string) => {
      const table = options.schema.user
      const users = await db.select().from(table).where(eq(table.id, id))
      if (users.length === 0) throw new Error('User not found')
      if (users.length > 1) throw new Error('Multiple users found')
      const user = users[0]
      return user
    },
    findByEmail: async (email: string) => {
      const table = options.schema.user

      const users = await db.select().from(table).where(eq(table.email, email))
      if (users.length === 0) throw new Error('User not found')
      if (users.length > 1) throw new Error('Multiple users found')
      const user = users[0]
      return user
    },
    list: async (pagination: Pagination<keyof AnyUserTable['_']['columns']>) => {
      const { page = 1, pageSize = 10, sort } = pagination
      const table = options.schema.user
      const users = await db
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
      const table = options.schema.user
      const user = await db.insert(table).values(data).returning()
      return user[0]
    },
  }
  const account = {
    link: async (data: Omit<InferTableType<AnyAccountTable>, 'id' | 'emailVerified'>) => {
      const table = options.schema.account
      const user = await db.insert(table).values(data).returning()
      return user[0]
    },
    updatePassword: async (userId: string, password: string) => {
      const table = options.schema.account
      const account = await db
        .update(table)
        .set({ password })
        .where(and(eq(table.userId, userId), eq(table.providerId, AccountProvider.CREDENTIAL)))
        .returning()
      if (account.length === 0) throw new Error('Account not found')
      if (account.length > 1) throw new Error('Multiple accounts found')
      return account[0]
    },
    findByUserEmailAndProvider: async (email: string, providerId: AccountProvider) => {
      const accounts = await db
        .select({
          user: options.schema.user,
          password: options.schema.account.password,
        })
        .from(options.schema.account)
        .leftJoin(options.schema.user, eq(options.schema.account.userId, options.schema.user.id))
        .where(
          and(
            eq(options.schema.user.email, email),
            eq(options.schema.account.providerId, providerId)
          )
        )
      if (accounts.length === 0) throw new Error('Account not found')
      if (accounts.length > 1) throw new Error('Multiple accounts found')
      return accounts[0] as unknown as {
        password: InferTableType<AnyAccountTable>['password']
        user: InferTableType<AnyUserTable>
      }
    },
  }
  const session = {
    create: async (data: { userId: string; expiresAt: Date }) => {
      const table = options.schema.session
      const token = crypto.randomUUID()
      const session = await db
        .insert(table)
        .values({ ...data, token })
        .returning()
      return session[0]
    },
    update: async (id: string, data: any) => {
      const table = options.schema.session
      const session = await db.update(table).set(data).where(eq(table.id, id)).returning()
      return session[0]
    },
    findUserBySessionToken: async (token: string) => {
      const sessions = await db
        .select({
          id: options.schema.session.id,
          user: options.schema.user,
          expiresAt: options.schema.session.expiresAt,
        })
        .from(options.schema.session)
        .leftJoin(options.schema.user, eq(options.schema.session.userId, options.schema.user.id))
        .where(eq(options.schema.session.token, token))
      if (sessions.length === 0) throw new Error('Session not found')
      if (sessions.length > 1) throw new Error('Multiple sessions found')
      const session = sessions[0]
      return session as unknown as {
        id: InferTableType<AnySessionTable>['id']
        user: InferTableType<AnyUserTable>
        expiresAt: InferTableType<AnySessionTable>['expiresAt']
      }
    },
    deleteById: async (id: string) => {
      const table = options.schema.session
      const session = await db.delete(table).where(eq(table.id, id)).returning()
      return session[0]
    },
    deleteByToken: async (token: string) => {
      const table = options.schema.session
      const session = await db.delete(table).where(eq(table.token, token)).returning()
      return session[0]
    },
    deleteByUserId: async (userId: string) => {
      const table = options.schema.session
      const session = await db.delete(table).where(eq(table.userId, userId)).returning()
      return session[0]
    },
  }

  const verification = {
    create: async (data: { identifier: string; value: string; expiresAt: Date }) => {
      const table = options.schema.verification
      const verification = await db.insert(table).values(data).returning()
      return verification[0]
    },
    findByIdentifier: async (identifier: string) => {
      const table = options.schema.verification
      const verifications = await db.select().from(table).where(eq(table.identifier, identifier))
      if (verifications.length === 0) throw new Error('Verification not found')
      if (verifications.length > 1) throw new Error('Multiple verifications found')
      return verifications[0]
    },
    delete: async (id: string) => {
      const table = options.schema.verification
      const verification = await db.delete(table).where(eq(table.id, id)).returning()
      if (verification.length === 0) throw new Error('Verification not found')
      return verification[0]
    },
    deleteByUserIdAndIdentifierPrefix: async (userId: string, identifierPrefix: string) => {
      const table = options.schema.verification
      return await db
        .delete(table)
        .where(and(eq(table.value, userId), like(table.identifier, `${identifierPrefix}%`)))
        .returning()
    },
    findByResetPasswordToken: async (token: string) => {
      const identifier = `reset-password:${token}`
      const table = options.schema.verification
      const verifications = await db.select().from(table).where(eq(table.identifier, identifier))
      if (verifications.length === 0) throw new Error('Verification not found')
      if (verifications.length > 1) throw new Error('Multiple verifications found')
      return verifications[0]
    },
    createWithResetPasswordToken: async (userId: string, expiresInMs?: number) => {
      const table = options.schema.verification
      const token = crypto.randomUUID()
      const identifier = `reset-password:${token}`
      const expiresAt = new Date(Date.now() + (expiresInMs ?? 1000 * 60 * 15)) // default 15 mins
      const verification = await db
        .insert(table)
        .values({ identifier, value: userId, expiresAt })
        .returning()
      return verification[0]
    },
  }

  return {
    user,
    account,
    session,
    verification,
  }
}

export type AuthInternalHandler = ReturnType<typeof createAuthInternalHandler>
