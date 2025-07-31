import { z } from 'zod/v4'

import { builder } from '../../helper'
import { AuthService } from '../../services/auth.service'

export const setupApi = builder.endpoint(
  {
    method: 'POST',
    path: '/auth/setup',
    body: z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    }),
    responses: {
      200: z.object({
        success: z.boolean(),
      }),
    },
  },
  async (payload) => {
    await AuthService.setup({
      name: payload.body.name,
      email: payload.body.email,
      password: payload.body.password,
    })

    return {
      status: 200,
      body: {
        success: true,
      },
    }
  }
)
