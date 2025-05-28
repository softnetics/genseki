import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import type { AuthContext } from './auth/context'

export class Context<
  TFullSchema extends Record<string, unknown>,
  TContext extends Record<string, unknown> = Record<string, unknown>,
> {
  constructor(
    public readonly db: NodePgDatabase<TFullSchema>,
    protected readonly ctx: TContext,
    protected readonly authContext?: AuthContext
  ) {}

  get<TName extends keyof TContext>(name: TName): TContext[TName] {
    const value = this.ctx[name]
    if (value === undefined) {
      throw new Error(`Key "${String(name)}" not found in context.`)
    }
    return value
  }

  toRequestContext(headers: Record<string, string> = {}): RequestContext<TFullSchema, TContext> {
    return new RequestContext<TFullSchema, TContext>(this.ctx, this.db, this.authContext, headers)
  }
}

export class RequestContext<
  TFullSchema extends Record<string, unknown>,
  TContext extends Record<string, unknown> = Record<string, unknown>,
> extends Context<TFullSchema, TContext> {
  private _state: Record<string, unknown> = {}
  private _user: Awaited<ReturnType<AuthContext['requiredAuthenticated']>> | undefined = undefined

  constructor(
    ctx: TContext,
    db: NodePgDatabase<TFullSchema>,
    authContext: AuthContext | undefined,
    private readonly _headers: Record<string, string>
  ) {
    super(db, ctx, authContext)

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
