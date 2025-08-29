import z from 'zod'

import type { AnyContextable } from '@genseki/react'
import { createEndpoint, createPlugin } from '@genseki/react'

import type { PhoneService } from './service'
import type { PhoneStore } from './store'
import type { AnyPluginSchema, BaseSignUpBodySchema } from './types'

export interface PhonePluginOptions<
  TSignUpBody extends BaseSignUpBodySchema = BaseSignUpBodySchema,
> {
  login?: {
    sessionExpiredInSeconds?: number // default to 3600 seconds (1 hour)
    hashPassword?: (password: string) => Promise<string>
    verifyPassword?: (password: string, hashed: string) => Promise<boolean>
  }
  signUp: {
    body: TSignUpBody
    onOtpSent: (data: {
      phone: string
      name: string
      refCode: string
    }) => Promise<{ token: string; refCode: string }>
    onOtpVerify: (data: { phone: string; token: string; pin: string }) => Promise<boolean>
  }
  changePhone?: {
    onOtpSent: (data: {
      phone: string
      name: string | undefined | null
      refCode: string
    }) => Promise<{ token: string; refCode: string }>
    onOtpVerify: (data: { phone: string; token: string; pin: string }) => Promise<boolean>
  }
  forgotPassword?: {
    onOtpSent: (data: {
      phone: string
      name: string | undefined | null
      refCode: string
    }) => Promise<{ token: string; refCode: string }>
    onOtpVerify: (data: { phone: string; token: string; pin: string }) => Promise<boolean>
  }
}

export function phone<
  TContext extends AnyContextable,
  TPhoneService extends PhoneService<TContext, AnyPluginSchema, any, PhoneStore<any>>,
>(context: TContext, service: TPhoneService) {
  const sendSignUpOtpEndpoint = createEndpoint(
    context,
    {
      method: 'POST',
      path: '/auth/phone/sign-up/otp',
      body: service.signUpBody as TPhoneService['signUpBody'],
      responses: {
        200: z.object({
          token: z.string(),
          refCode: z.string(),
          resendAttempt: z.number(),
          submitAttempt: z.number(),
        }),
        500: z.looseObject({
          code: z.enum([
            'FEATURE_NOT_ENABLED',
            'USER_ALREADY_EXISTS',
            'MAX_OTP_SEND_LIMIT_REACHED',
            'FAILED_TO_SEND_OTP',
            'FAILED_TO_CREATE_VERIFICATION',
          ]),
          message: z.string(),
        }),
      },
    },
    async (payload) => {
      const body = (payload as any).body

      const response = await service.sendSignUpPhoneOtp(body)

      if (response.isErr()) {
        return {
          status: 500,
          body: response.error,
        }
      }

      return {
        status: 200,
        body: {
          token: response.value.token,
          refCode: response.value.refCode,
          resendAttempt: response.value.resendAttempt,
          submitAttempt: response.value.submitAttempt,
        },
      }
    }
  )

  const verifySignUpOtpEndpoint = createEndpoint(
    context,
    {
      method: 'POST',
      path: '/auth/phone/sign-up/otp/verify',
      body: z.object({
        token: z.string(),
        refCode: z.string(),
        pin: z.string().min(1, 'Please enter the OTP'),
        phone: z.string(),
      }),
      responses: {
        200: z.object({
          message: z.string(),
        }),
        500: z.looseObject({
          code: z.enum([
            'INVALID_OR_EXPIRED_VERIFICATION_TOKEN',
            'REACHED_MAX_ATTEMPTS',
            'FAILED_OTP_VERIFICATION',
            'INVALID_OTP',
            'ACCOUNT_NOT_FOUND',
            'INTERNAL_SERVER_ERROR',
          ]),
          message: z.string(),
        }),
      },
    },
    async (payload) => {
      const body = payload.body

      const response = await service.verifySignUpPhoneOtp(body)

      if (response.isErr()) {
        return {
          status: 500,
          body: response.error,
        }
      }

      return {
        status: 200,
        body: { message: 'Sign up success' },
      }
    }
  )

  const sendForgotPasswordOtpEndpoint = createEndpoint(
    context,
    {
      method: 'POST',
      path: '/auth/phone/forgot-password/otp',
      body: z.object({
        phone: z.string(),
      }),
      responses: {
        200: z.object({
          refCode: z.string(),
          token: z.string(),
          resendAttempt: z.number(),
          submitAttempt: z.number(),
        }),
        500: z.looseObject({
          code: z.enum([
            'FEATURE_NOT_ENABLED',
            'REACHED_MAX_ATTEMPTS',
            'FAILED_TO_SEND_OTP',
            'FAILED_TO_CREATE_VERIFICATION',
          ]),
          message: z.string(),
        }),
      },
    },
    async (payload) => {
      const response = await service.sendForgotPasswordOtp(payload.body.phone)

      if (response.isErr()) {
        return {
          status: 500,
          body: response.error,
        }
      }

      return {
        status: 200,
        body: {
          refCode: response.value.refCode,
          token: response.value.token,
          resendAttempt: response.value.resendAttempt,
          submitAttempt: response.value.submitAttempt,
        },
      }
    }
  )

  const verifyForgotPasswordOtpEndpoint = createEndpoint(
    context,
    {
      method: 'POST',
      path: '/auth/phone/forgot-password/otp/verify',
      body: z.object({
        token: z.string(),
        refCode: z.string(),
        pin: z.string().min(1),
        phone: z.string(),
      }),
      responses: {
        200: z.object({
          token: z.string(),
        }),
        500: z.looseObject({
          code: z.enum([
            'FEATURE_NOT_ENABLED',
            'INVALID_OR_EXPIRED_VERIFICATION_TOKEN',
            'REACHED_MAX_ATTEMPTS',
            'FAILED_TO_VERIFY_OTP',
            'FAILED_TO_INCREASE_ATTEMPT',
            'INVALID_OTP',
            'ACCOUNT_NOT_FOUND',
          ]),
          message: z.string(),
        }),
      },
    },
    async (payload) => {
      const response = await service.verifyForgotPasswordOtp(payload.body)

      if (response.isErr()) {
        return {
          status: 500,
          body: response.error,
        }
      }

      return {
        status: 200,
        body: { token: response.value.token },
      }
    }
  )

  const resetPasswordOtpEndpoint = createEndpoint(
    context,
    {
      method: 'POST',
      path: '/auth/phone/forgot-password/reset',
      body: z.object({
        token: z.string().min(1),
        oldPassword: z.string().min(1),
        newPassword: z.string().min(1),
      }),
      responses: {
        200: z.object({
          message: z.string(),
        }),
        500: z.looseObject({
          code: z.enum([
            'INVALID_OR_EXPIRED_VERIFICATION_TOKEN',
            'ACCOUNT_NOT_FOUND',
            'ACCOUNT_NOT_SUPPORTED',
            'OLD_PASSWORD_INCORRECT',
            'NEW_PASSWORD_SAME_AS_OLD',
            'FAILED_TO_UPDATE_PASSWORD',
            'FAILED_TO_DELETE_PASSWORD_VERIFICATION',
          ]),
          message: z.string(),
        }),
      },
    },
    async ({ body }) => {
      const response = await service.resetPassword({
        token: body.token,
        password: { old: body.oldPassword, new: body.newPassword },
      })

      if (response.isErr()) {
        return {
          status: 500,
          body: response.error,
        }
      }

      return {
        status: 200,
        body: { message: 'Reset password successful' },
      }
    }
  )

  const changePhoneNumberEndpoint = createEndpoint(
    context,
    {
      method: 'POST',
      path: '/auth/phone/change',
      body: z.object({
        oldPhoneNumber: z.string().min(1),
        newPhoneNumber: z.string().min(1),
      }),
      responses: {
        200: z.object({
          refCode: z.string(),
          token: z.string(),
          resendAttempt: z.number(),
          submitAttempt: z.number(),
        }),
        500: z.looseObject({
          code: z.enum([
            'FEATURE_NOT_ENABLED',
            'USER_NOT_FOUND',
            'PHONE_EXISTS',
            'REACHED_MAX_OTP_SEND_LIMIT',
            'NEW_PHONE_AND_PHONE_IS_THE_SAME',
            'CURRENT_PHONE_AND_OLD_PHONE_IS_NOT_THE_SAME',
            'INTERNAL_SERVER_ERROR',
          ]),
          message: z.string(),
        }),
      },
    },
    async ({ context, body }) => {
      const user = await context.requiredAuthenticated()

      const response = await service.sendChangePhoneNumberOtp(user.id, {
        new: body.newPhoneNumber,
        old: body.oldPhoneNumber,
      })

      if (response.isErr()) {
        return {
          status: 500,
          body: response.error,
        }
      }

      return {
        status: 200,
        body: {
          refCode: response.value.refCode,
          token: response.value.token,
          resendAttempt: response.value.resendAttempt,
          submitAttempt: response.value.submitAttempt,
        },
      }
    }
  )

  const verifyChangePhoneNumberEndpoint = createEndpoint(
    context,
    {
      method: 'POST',
      path: '/auth/phone/change/verify',
      body: z.object({
        refCode: z.string(),
        token: z.string(),
        pin: z.string(),
      }),
      responses: {
        200: z.object({
          message: z.string(),
        }),
        500: z.looseObject({
          code: z.enum([
            'FEATURE_NOT_ENABLED',
            'INVALID_OR_EXPIRED_VERIFICATION_TOKEN',
            'REACHED_MAX_ATTEMPTS',
            'FAILED_OTP_VERIFICATION',
            'INVALID_OTP',
            'INTERNAL_SERVER_ERROR',
          ]),
          message: z.string(),
        }),
      },
    },
    async ({ context, body }) => {
      const user = await context.requiredAuthenticated()

      const response = await service.verifyChangePhoneNumberOtp(user.id, {
        refCode: body.refCode,
        pin: body.pin,
        token: body.token,
      })

      if (response.isErr()) {
        return {
          status: 500,
          body: response.error,
        }
      }

      return {
        status: 200,
        body: { message: response.value.message },
      }
    }
  )

  return createPlugin('phone', (app) => {
    const api = {
      sendSignUpOtpEndpoint: sendSignUpOtpEndpoint as {
        schema: typeof sendSignUpOtpEndpoint.schema
        handler: any
      },
      verifySignUpOtpEndpoint,
      sendForgotPasswordOtpEndpoint,
      verifyForgotPasswordOtpEndpoint,
      resetPasswordOtpEndpoint,
      changePhoneNumberEndpoint,
      verifyChangePhoneNumberEndpoint,
    } as const

    return app.addApiRouter(api)
  })
}

export { PhoneService } from './service'
export { PhoneStore } from './store'
