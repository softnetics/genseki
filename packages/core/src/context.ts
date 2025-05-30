import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import type { AuthContext } from './auth/context'

export class Context<
  TContext extends Record<string, unknown> = Record<string, unknown>,
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  _TUser extends Record<string, unknown> = Record<string, unknown>,
> {
  public readonly db: NodePgDatabase<TFullSchema>

  constructor(
    protected readonly ctx: TContext,
    protected readonly authContext?: AuthContext
  ) {
    this.db = ctx.db as any
  }

  get<TName extends Exclude<keyof TContext, 'db'>>(name: TName): TContext[TName] {
    const value = this.ctx[name]
    if (value === undefined) {
      throw new Error(`Key "${String(name)}" not found in context.`)
    }
    return value
  }

  static toRequestContext<TContext extends Record<string, unknown> = Record<string, unknown>>(
    ctx: Context<TContext>,
    authContext?: AuthContext,
    headers: Record<string, string> = {}
  ): RequestContext<TContext> {
    return new RequestContext<TContext>(ctx.ctx, ctx.authContext ?? authContext, headers)
  }
}

export class RequestContext<
  TContext extends Record<string, unknown> = Record<string, unknown>,
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TUser extends Record<string, unknown> = Record<string, unknown>,
> extends Context<TContext, TFullSchema, TUser> {
  private _state: Record<string, unknown> = {}
  private _user: TUser | undefined = undefined

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
    if (!user) {
      throw new Error('Unauthorized')
    }
    this._user = user as unknown as TUser

    return user
  }

  get headers() {
    return this._headers
  }

  override get<TKey extends Exclude<keyof TContext, 'db'>>(name: TKey): TContext[TKey]
  override get(name: string): unknown
  override get(name: string): unknown {
    try {
      const value = super.get(name as any)
      return value
    } catch {
      const value = this._state[name as string]
      if (value === undefined) {
        throw new Error(`Key "${String(name)}" not found in context.`)
      }
      return value
    }
  }

  set(key: string, value: unknown) {
    this._state[key] = value
  }
}
