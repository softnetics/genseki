import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import type { AuthContext } from './auth/context'

export class Context<TContext extends Record<string, unknown> = Record<string, unknown>> {
  public readonly db: TContext extends { db: NodePgDatabase<infer TFullSchema> }
    ? NodePgDatabase<TFullSchema>
    : never

  constructor(
    protected readonly ctx: TContext,
    protected readonly authContext?: AuthContext
  ) {
    this.db = ctx.db as any
  }

  get<TName extends keyof TContext>(name: TName): TContext[TName] {
    const value = this.ctx[name]
    if (value === undefined) {
      throw new Error(`Key "${String(name)}" not found in context.`)
    }
    return value
  }

  static toRequestContext<TContext extends Record<string, unknown> = Record<string, unknown>>(
    ctx: Context<TContext>,
    headers: Record<string, string> = {}
  ): RequestContext<TContext> {
    return new RequestContext<TContext>(ctx.ctx, ctx.authContext, headers)
  }

  static getCtx<TContext extends Record<string, unknown> = Record<string, unknown>>(
    ctx: Context<TContext>
  ): TContext {
    return ctx.ctx
  }
}

export class RequestContext<
  TContext extends Record<string, unknown> = Record<string, unknown>,
> extends Context<TContext> {
  private _state: Record<string, unknown> = {}
  private _user: Awaited<ReturnType<AuthContext['requiredAuthenticated']>> | undefined = undefined

  constructor(
    ctx: TContext,
    authContext: AuthContext | undefined,
    private readonly _headers: Record<string, string>
  ) {
    super(ctx, authContext)

    this._headers = _headers || {}
  }

  async requiredAuthenticated() {
    if (this._user) {
      return this._user
    }

    const user = await this.authContext?.requiredAuthenticated(this._headers)
    this._user = user

    return user
  }

  get headers() {
    return this._headers
  }

  override get<
    TKey extends string | number | symbol,
    TValue extends TKey extends keyof TContext ? TContext[TKey] : any,
  >(name: TKey): TValue {
    try {
      const value = this.ctx[name as keyof TContext]
      return value as TValue
    } catch {
      const value = this._state[name as string]
      if (value === undefined) {
        throw new Error(`Key "${String(name)}" not found in context.`)
      }
      return value as TValue
    }
  }

  set(key: string, value: unknown) {
    this._state[key] = value
  }
}
