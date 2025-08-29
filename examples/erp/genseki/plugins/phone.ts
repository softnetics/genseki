import z from 'zod'

import { phone, PhoneService, PhoneStore } from '@genseki/plugins'

import { FullModelSchemas } from '../../generated/genseki/unsanitized'
import { context, prisma } from '../helper'

const body = z.object({
  name: z.string(),
  phone: z.string(),
  password: z.string(),
  email: z.email().optional(),
})

class CustomPhoneStore extends PhoneStore<typeof body> {
  async createUser(data: z.infer<typeof body>): Promise<string> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    })
    return user.id
  }
}

const phoneStore = new CustomPhoneStore(prisma as any)

const refCode = 'ref9'
const token = 'token9'
const pin = '9'

const phoneService = new PhoneService(
  context,
  {
    user: FullModelSchemas.user,
    account: FullModelSchemas.account,
    session: FullModelSchemas.session,
    verification: FullModelSchemas.verification,
  },
  {
    signUp: {
      body: body,
      onOtpSent: async () => {
        return {
          refCode: refCode,
          token: token,
        }
      },
      onOtpVerify: async (payload) => {
        if (payload.token === token && payload.pin === pin) return true
        return false
      },
    },
    changePhone: {
      onOtpSent: async () => {
        return {
          refCode: refCode,
          token: token,
        }
      },
      onOtpVerify: async (payload) => {
        if (payload.token === token && payload.pin === pin) return true
        return false
      },
    },
    forgotPassword: {
      onOtpSent: async () => {
        return {
          refCode: refCode,
          token: token,
        }
      },
      onOtpVerify: async (payload) => {
        if (payload.token === token && payload.pin === pin) return true
        return false
      },
    },
  },
  phoneStore
)

export const phonePlugin = phone(context, phoneService)
