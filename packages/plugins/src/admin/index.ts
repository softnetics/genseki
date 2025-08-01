import { deepmerge } from 'deepmerge-ts'
import type { SimplifyDeep, ValueOf } from 'type-fest'
import { z } from 'zod/v4'

import type {
  AnyContextable,
  AnyTable,
  AnyTypedFieldColumn,
  AnyUserTable as BaseAnyUserTable,
  DataType,
  IsValidTable,
  WithIsList,
  WithIsRequired,
} from '@genseki/react'
import { Builder, createPlugin } from '@genseki/react'

type AnyUserTable = AnyTable<{
  columns: {
    roles: WithIsList<WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>>
    banned: AnyTypedFieldColumn<typeof DataType.BOOLEAN>
    bannedReason: AnyTypedFieldColumn<typeof DataType.STRING>
    bannedExpiredAt: AnyTypedFieldColumn<typeof DataType.DATETIME>
  }
  relations: {}
  uniqueFields: any
  primaryFields: any
}> &
  BaseAnyUserTable

type AccessControlStatements = {
  [K in string]: string[] | AccessControlStatements
}

export type AnyPluginSchema = {
  user: any
}

type PluginSchema = {
  user: AnyUserTable
}

type ValidateSchema<TSchema extends AnyPluginSchema> = {
  user: IsValidTable<PluginSchema['user'], TSchema['user']>
} extends {
  user: true
}
  ? AdminPluginOptions
  : {
      user: IsValidTable<PluginSchema['user'], TSchema['user']>
    }

export interface AdminPluginOptions {
  accessControl: AccessControl<any, any>
}

type GetAccessControlPermission<TStatements extends AccessControlStatements> = ValueOf<{
  [K in keyof TStatements]: TStatements[K] extends (infer U extends string)[]
    ? `${Extract<K, string>}.${U}`
    : TStatements[K] extends AccessControlStatements
      ? `${Extract<K, string>}.${GetAccessControlPermission<TStatements[K]>}`
      : never
}>

type GetPartialStatement<TStatements extends AccessControlStatements> = {
  [K in keyof TStatements]?: TStatements[K] extends (infer U extends string)[]
    ? U[]
    : TStatements[K] extends AccessControlStatements
      ? GetPartialStatement<TStatements[K]>
      : never
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

  private _isNestedContain(
    rolePermissions: AccessControlStatements,
    permissions: string[]
  ): boolean {
    if (permissions.length === 0) return false
    const head = permissions.shift()
    if (!head) return false
    const value = rolePermissions[head]
    if (Array.isArray(value) && value.includes(permissions[0])) {
      return true
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      return this._isNestedContain(value, permissions)
    }
    return false
  }

  hasPermission(role: string, permission: GetAccessControlPermission<TStatements>): boolean {
    const rolePermissions = this.roles[role]
    if (!rolePermissions) return false
    const permissions = permission.split('.')
    return this._isNestedContain(rolePermissions as AccessControlStatements, permissions)
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

function isOptions(options: any): options is AdminPluginOptions {
  return !('user' in options)
}

export function admin<TContext extends AnyContextable, TSchema extends AnyPluginSchema>(
  context: TContext,
  schema: TSchema,
  options: ValidateSchema<TSchema>
) {
  if (!isOptions(options)) {
    throw new Error('Invalid options provided to admin plugin')
  }

  return createPlugin({
    name: 'admin',
    plugin: (input) => {
      const prisma = context.getPrismaClient()
      const builder = new Builder({ schema: schema, context })

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
          const ok = options.accessControl.hasPermission(role, permission as never)
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
          const ok = options.accessControl.hasPermissions(role, permissions as never[])
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
        async ({ body }) => {
          const { userId } = body

          const banField = schema.user.shape.columns.banned
          const bannedReasonField = schema.user.shape.columns.bannedReason
          const bannedExpiredAtField = schema.user.shape.columns.bannedExpiredAt

          await prisma[schema.user.config.prismaModelName].update({
            where: { id: userId },
            data: {
              [banField.name]: true,
              [bannedReasonField.name]: body.reason ?? 'No reason provided',
              [bannedExpiredAtField.name]: body.expiresAt ?? null, // null means no expiration
            },
          })

          return {
            status: 200 as const,
            body: { ok: true },
          }
        }
      )

      const api = {
        hasPermission: hasPermissionEndpoint,
        hasPermissions: hasPermissionsEndpoint,
        banUser: banUserEndpoint,
      } as const

      return {
        api: {
          admin: api,
        },
        uis: [],
      }
    },
  })
}
