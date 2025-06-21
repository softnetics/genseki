import { deepmerge } from 'deepmerge-ts'
import { eq } from 'drizzle-orm'
import type { SimplifyDeep, ValueOf } from 'type-fest'
import { z } from 'zod/v4'

import type {
  AnyTypedColumn,
  BaseConfig,
  Context,
  WithAnyRelations,
  WithAnyTable,
  WithNotNull,
} from '@genseki/react'
import type { AnyUserTable as BaseAnyUserTable } from '@genseki/react'
import { Builder, createPlugin } from '@genseki/react'

type AnyUserTable = WithAnyTable<
  {
    role: WithNotNull<AnyTypedColumn<string>>
    banned: AnyTypedColumn<boolean | null>
    bannedReason: AnyTypedColumn<string | null>
    bannedExpiresAt: AnyTypedColumn<Date | null>
  },
  'user'
> &
  BaseAnyUserTable

interface AccessControlStatements extends Record<string, string[]> {}

// TODO: Add its UI page for this plugin
export interface AdminPluginOptions {
  accessControl: AccessControl<any, any>
}

type GetAccessControlPermission<TStatements extends AccessControlStatements> = ValueOf<{
  [K in keyof TStatements]: TStatements[K] extends (infer U extends string)[]
    ? `${Extract<K, string>}.${U}`
    : never
}>

type GetPartialStatement<TStatements extends AccessControlStatements> = {
  [K in keyof TStatements]?: TStatements[K] extends (infer U extends string)[] ? U[] : never
}

type AccessControlRoles<TStatements extends AccessControlStatements> = {
  [role: string]: GetPartialStatement<TStatements>
}

class AccessControl<
  const TStatements extends AccessControlStatements = AccessControlStatements,
  const TRoles extends AccessControlRoles<TStatements> = AccessControlRoles<TStatements>,
> {
  constructor(
    public readonly statements: TStatements,
    public readonly roles: TRoles
  ) {}

  hasPermission(role: string, permission: GetAccessControlPermission<TStatements>): boolean {
    const rolePermissions = this.roles[role]
    if (!rolePermissions) return false

    const [statement, action] = permission.split('.')
    const actions = rolePermissions[statement as keyof typeof rolePermissions]
    if (!actions) return false

    return actions.includes(action as string)
  }

  hasPermissions(role: string, permissions: GetAccessControlPermission<TStatements>[]): boolean {
    return permissions.every((permission) => this.hasPermission(role, permission))
  }
}

export function createAccessControl<
  const TStatements extends AccessControlStatements,
  const TRoles extends AccessControlRoles<TStatements>,
>(args: { statements: TStatements; roles: TRoles }): AccessControl<TStatements, TRoles> {
  return new AccessControl(args.statements, args.roles)
}

export function mergeAccessControl<
  const TLeftAccessControl extends AccessControl<any, any>,
  const TRightAccessControl extends AccessControl<any, any>,
>(
  left: TLeftAccessControl,
  right: TRightAccessControl
): AccessControl<
  SimplifyDeep<TLeftAccessControl['statements'] & TRightAccessControl['statements']>,
  SimplifyDeep<TLeftAccessControl['roles'] & TRightAccessControl['roles']>
> {
  const statements = deepmerge(left.statements, right.statements)
  const roles = deepmerge(left.roles, right.roles)

  return new AccessControl(
    statements as SimplifyDeep<
      TLeftAccessControl['statements'] & TRightAccessControl['statements']
    >,
    roles as SimplifyDeep<TLeftAccessControl['roles'] & TRightAccessControl['roles']>
  )
}

// TODO: TFullSchema should be Generic but it is not working with the current setup
export function admin<
  TContext extends Context<
    WithAnyRelations<{
      user: AnyUserTable
    }>
  >,
>(
  baseConfig: BaseConfig<
    WithAnyRelations<{
      user: AnyUserTable
    }>,
    TContext
  >,
  options: AdminPluginOptions
) {
  const schema = baseConfig.schema
  const builder = new Builder({ schema: baseConfig.schema }).$context<typeof baseConfig.context>()

  const userCollection = builder.collection('user', {
    slug: 'user',
    identifierColumn: 'id',
    fields: builder.fields('user', (fb) => ({
      name: fb.columns('name', {
        type: 'text',
      }),
      email: fb.columns('email', {
        type: 'text',
      }),
      role: fb.columns('role', {
        type: 'text',
      }),
      banned: fb.columns('banned', {
        type: 'checkbox',
      }),
      bannedReason: fb.columns('bannedReason', {
        type: 'text',
      }),
      bannedExpiresAt: fb.columns('bannedExpiresAt', {
        type: 'date',
      }),
    })),
  })

  const hasPermissionEndpoint = builder.endpoint(
    {
      method: 'POST',
      path: '/auth/admin/has-permission',
      body: z.object({
        role: z.string(),
        permission: z.string(),
      }),
      responses: {
        200: z.object({
          ok: z.boolean(),
        }),
      },
    },
    ({ body }) => {
      const { role, permission } = body
      const ok = options.accessControl.hasPermission(role, permission as `${string}.${string}`)
      return {
        status: 200 as const,
        body: { ok: ok },
      }
    }
  )

  const hasPermissionsEndpoint = builder.endpoint(
    {
      method: 'POST',
      path: '/auth/admin/has-permissions',
      body: z.object({
        role: z.string(),
        permissions: z.string().array(),
      }),
      responses: {
        200: z.object({
          ok: z.boolean(),
        }),
      },
    },
    ({ body }) => {
      const { role, permissions } = body
      const ok = options.accessControl.hasPermissions(role, permissions as `${string}.${string}`[])
      return {
        status: 200 as const,
        body: { ok: ok },
      }
    }
  )

  const banUserEndpoint = builder.endpoint(
    {
      method: 'POST',
      path: '/auth/admin/ban-user',
      body: z.object({
        userId: z.string(),
        reason: z.string().optional(),
        expiresAt: z.date().optional(),
      }),
      responses: {
        200: z.object({
          ok: z.boolean(),
        }),
      },
    },
    async ({ context, body }) => {
      const { userId } = body

      await context.db
        .update(schema.user)
        .set({
          banned: true,
          bannedReason: body.reason ?? 'No reason provided',
          bannedExpiresAt: body.expiresAt ?? null, // null means no expiration
        })
        .where(eq(schema.user.id, userId))

      return {
        status: 200 as const,
        body: { ok: true },
      }
    }
  )

  return createPlugin({
    name: 'admin',
    plugin: (input) => {
      return {
        ...input,
        collections: {
          ...input.collections,
          user: userCollection,
        },
        endpoints: {
          ...input.endpoints,
          'auth.hasPermission': hasPermissionEndpoint,
          'auth.hasPermissions': hasPermissionsEndpoint,
          'auth.banUser': banUserEndpoint,
        },
      }
    },
  })
}
