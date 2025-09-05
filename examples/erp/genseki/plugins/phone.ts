import z from 'zod'

import { generatePinCode, generateRefCode, phone, PhoneService, PhoneStore } from '@genseki/plugins'

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
        const pin = generatePinCode()
        console.log('PIN CODE', pin) // In real world, you should send this pin code to user via SMS
        return {
          refCode: generateRefCode(),
          token: crypto.randomUUID(),
          pin,
        }
      },
    },
    changePhone: {
      onOtpSent: async () => {
        const pin = generatePinCode()
        console.log('PIN CODE', pin) // In real world, you should send this pin code to user via SMS
        return {
          refCode: generateRefCode(),
          token: crypto.randomUUID(),
          pin,
        }
      },
    },
    forgotPassword: {
      onOtpSent: async () => {
        const pin = generatePinCode()
        console.log('PIN CODE', pin) // In real world, you should send this pin code to user via SMS
        return {
          refCode: generateRefCode(),
          token: crypto.randomUUID(),
          pin,
        }
      },
    },
  },
  phoneStore
)

export const phonePlugin = phone(context, phoneService)
