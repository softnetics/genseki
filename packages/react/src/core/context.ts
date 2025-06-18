import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import type { AuthContext } from '../auth/context'

export class Context<
  const TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  const TContextValue extends Record<string, unknown> = Record<string, unknown>,
  const TUser extends Record<string, unknown> = Record<string, unknown>,
> {
  constructor(
    public readonly db: NodePgDatabase<TFullSchema>,
    protected readonly ctx?: TContextValue,
    protected readonly authContext?: AuthContext
  ) {}

  get<TName extends Exclude<keyof TContextValue, 'db'>>(name: TName): TContextValue[TName] {
    const value = this.ctx?.[name]
    if (value === undefined) {
      throw new Error(`Key "${String(name)}" not found in context.`)
    }
    return value
  }

  static toRequestContext<
    TFullSchema extends Record<string, unknown> = Record<string, unknown>,
    TContextValue extends Record<string, unknown> = Record<string, unknown>,
    TUser extends Record<string, unknown> = Record<string, unknown>,
  >(
    ctx: Context<TFullSchema, TContextValue, TUser>,
    config?: {
      authContext?: AuthContext
      headers?: Record<string, string>
    }
  ): RequestContext<TFullSchema, TContextValue, TUser> {
    return new RequestContext<TFullSchema, TContextValue, TUser>(
      ctx.db,
      (ctx.ctx ?? {}) as TContextValue,
      ctx.authContext ?? config?.authContext,
      config?.headers || {}
    )
  }
}

export type AnyContext = Context<any, any, any>

export class RequestContext<
  const TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  const TContextValue extends Record<string, unknown> = Record<string, unknown>,
  const TUser extends Record<string, unknown> = Record<string, unknown>,
> extends Context<TFullSchema, TContextValue, TUser> {
  private _state: Record<string, unknown> = {}
  private _user: TUser | undefined = undefined

  constructor(
    public readonly db: NodePgDatabase<TFullSchema>,
    protected readonly ctx?: TContextValue,
    protected readonly authContext?: AuthContext,
    private readonly _headers?: Record<string, string>
  ) {
    super(db, ctx, authContext)

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

  override get<TKey extends Exclude<keyof TContextValue, 'db'>>(name: TKey): TContextValue[TKey]
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

export type ContextToRequestContext<TContext extends AnyContext> =
  TContext extends Context<infer TContextValue, infer TFullSchema, infer TUser>
    ? RequestContext<TContextValue, TFullSchema, TUser>
    : never
