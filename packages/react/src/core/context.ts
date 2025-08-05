import type { IsAny, Promisable } from 'type-fest'
import type z from 'zod'

import { HttpUnprocessableEntityError } from './error'
import type { MockPrismaClient } from './prisma.types'

import { getSessionCookie } from '../auth/utils'

interface BaseUser {
  id: string
}

export abstract class RequestContextable<TUser extends BaseUser = BaseUser> {
  constructor(
    private readonly context: AnyContextable,
    private readonly request: Request
  ) {}

  abstract authenticate(): Promisable<TUser>

  getRequest() {
    return this.request
  }

  getSessionCookie() {
    return getSessionCookie(this.request)
  }

  getUserSchema(): z.ZodType<TUser> {
    return this.context.getUserSchema()
  }

  async requiredAuthenticated() {
    const result = await this.authenticate()
    const schema = this.getUserSchema()
    const parsed = schema.safeParse(result)
    if (!parsed.success) throw new HttpUnprocessableEntityError(parsed.error)
    return parsed.data
  }
}

export type AnyRequestContextable = RequestContextable<any>

export interface Contextable<TUser extends BaseUser = BaseUser> {
  getUserSchema(): z.ZodType<TUser>
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
