import type { IsAny } from 'type-fest'

import type { MaybePromise } from './collection'

interface BaseUser {
  id: string
}

export abstract class RequestContextable<TUser extends BaseUser = BaseUser> {
  constructor(private readonly request: Request) {}
  getRequest() {
    return this.request
  }

  abstract requiredAuthenticated(): MaybePromise<TUser>
}

export type AnyRequestContextable = RequestContextable<any>

export interface Contextable<TUser extends BaseUser = BaseUser> {
  toRequestContext(request: Request): RequestContextable<TUser>
}

export type AnyContextable = Contextable<any>

export type ContextToRequestContext<TContext extends AnyContextable> =
  ReturnType<TContext['toRequestContext']> extends RequestContextable<infer TUser>
    ? IsAny<TUser> extends true
      ? // TODO: Recheck why AnyRequestContextable is not working here
        any
      : RequestContextable<TUser>
    : never
