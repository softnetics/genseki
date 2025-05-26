import { z } from 'zod'

import { createEndpoint } from '../../endpoint'
import type { AnyTypedColumn, WithAnyTable, WithHasDefault, WithNotNull } from '../../table'
import { createPlugin } from '..'

// TODO: Implement the admin plugin functionality
// Admin plugin provides administrative features for managing the application, such as user management, role assignments, and banning users.
// Including users collection (UI and API), and custom access control.

type AnyUserTable = WithAnyTable<{
  id: WithHasDefault<WithNotNull<AnyTypedColumn<string>>>
  name: WithNotNull<AnyTypedColumn<string>>
  email: WithNotNull<AnyTypedColumn<string>>
  emailVerified: WithNotNull<AnyTypedColumn<boolean>>
  image: AnyTypedColumn<string | null>
  role: WithNotNull<AnyTypedColumn<string>>
  banned: AnyTypedColumn<boolean | null>
  bannedReason: AnyTypedColumn<string | null>
  bannedExpiresAt: AnyTypedColumn<Date | null>
}>

export interface AdminPluginOptions {
  schema: {
    user: AnyUserTable
  }
  // TODO: Define specific access control rules for the admin plugin
  accessControl: {}
}

export function admin(options?: AdminPluginOptions) {
  return createPlugin((input) => {
    return {
      ...input,
      endpoints: {
        ...input.endpoints,
        example: createEndpoint(
          {
            method: 'GET',
            path: 'example',
            responses: {
              200: z.object({
                message: z.string(),
              }),
            },
          },
          () => {
            return {
              status: 200 as const,
              body: {
                message: 'Hello from the admin plugin!',
              },
            }
          }
        ),
      },
    }
  })
}
