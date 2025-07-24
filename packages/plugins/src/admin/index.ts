import { deepmerge } from 'deepmerge-ts'
import type { SimplifyDeep, ValueOf } from 'type-fest'
import { z } from 'zod/v4'

import type {
  AnyContextable,
  AnyTable,
  AnyTypedFieldColumn,
  AnyUserTable as BaseAnyUserTable,
  DataType,
  WithIsRequired,
} from '@genseki/react'
import { Builder, createPlugin } from '@genseki/react'

type AnyUserTable = AnyTable<{
  columns: {
    role: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
    banned: AnyTypedFieldColumn<typeof DataType.BOOLEAN>
    bannedReason: AnyTypedFieldColumn<typeof DataType.STRING>
    bannedExpiresAt: AnyTypedFieldColumn<typeof DataType.DATETIME>
  }
  relations: {}
}> &
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
export function admin<TContext extends AnyContextable>(
  context: TContext,
  options: {
    schema: {
      user: AnyUserTable
    }
    options: AdminPluginOptions
    accessControl: AccessControl
  }
) {
  return createPlugin({
    name: 'admin',
    plugin: (input) => {
      const prisma = context.getPrismaClient()
      const builder = new Builder({ schema: options.schema, context })

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
          const ok = options.accessControl.hasPermissions(
            role,
            permissions as `${string}.${string}`[]
          )
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

          const banField = options.schema.user.shape.columns.banned
          const bannedReasonField = options.schema.user.shape.columns.bannedReason
          const bannedExpiresAtField = options.schema.user.shape.columns.bannedExpiresAt

          await prisma[options.schema.user.config.prismaModelName].update({
            where: { id: userId },
            data: {
              [banField.name]: true,
              [bannedReasonField.name]: body.reason ?? 'No reason provided',
              [bannedExpiresAtField.name]: body.expiresAt ?? null, // null means no expiration
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
