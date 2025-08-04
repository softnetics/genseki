import type { IsAny, Promisable } from 'type-fest'

import type { MockPrismaClient } from './prisma.types'

import { getSessionCookie } from '../auth/utils'

interface BaseUser {
  id: string
}

export abstract class RequestContextable<TUser extends BaseUser = BaseUser> {
  constructor(private readonly request: Request) {}

  getRequest() {
    return this.request
  }

  getSessionCookie() {
    return getSessionCookie(this.request)
  }

  abstract requiredAuthenticated(): Promisable<TUser>
}

export type AnyRequestContextable = RequestContextable<any>

export interface Contextable<TUser extends BaseUser = BaseUser> {
  getPrismaClient(): MockPrismaClient
  toRequestContext(request: Request): RequestContextable<TUser>
}

export type AnyContextable = Contextable<any>

export type ContextToRequestContext<TContext extends AnyContextable> =
  ReturnType<TContext['toRequestContext']> extends infer TRequestContext extends RequestContextable<
    infer TUser
  >
    ? IsAny<TUser> extends true
      ? // TODO: Recheck why AnyRequestContextable is not working here
        any
      : TRequestContext
    : never
