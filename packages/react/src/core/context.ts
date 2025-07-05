import type { MaybePromise } from './collection'

interface BaseUser {
  id: string
}

export interface RequestContextArgs {
  headers?: Record<string, string>
}

export interface RequestContextable<TUser extends BaseUser = BaseUser> {
  requiredAuthenticated(): MaybePromise<TUser>
}

export type AnyRequestContextable = RequestContextable<any>

export interface Contextable<TUser extends BaseUser = BaseUser> {
  toRequestContext(args: RequestContextArgs): RequestContextable<TUser>
}

export type AnyContextable = Contextable<any>

export type ContextToRequestContext<TContext extends AnyContextable> = ReturnType<
  TContext['toRequestContext']
>
