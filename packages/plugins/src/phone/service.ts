import defu from 'defu'
import { err, ok } from 'neverthrow'
import type { PartialDeep } from 'type-fest'
import type z from 'zod'

import {
  AccountProvider,
  type AnyContextable,
  type ObjectWithOnlyValue,
  Password,
  type ValidateSchema,
} from '@genseki/react'

import type {
  ChangePhoneNumberVerificationPayload,
  ForgotPasswordVerificationPayload,
  PhoneStore,
  SignUpVerificationPayload,
} from './store'
import type { BaseSignUpBodySchema, PluginSchema } from './types'

interface OnOtpSentArgs {
  phone: string
  name: string | undefined | null
}

interface OnOtpSentReturn {
  token: string
  refCode: string
  pin?: string // Provided when using manual OTP handling
}

interface OnOtpVerification<T> {
  phone: string
  token: string
  pin: string
  verification: { id: string; value: T; createdAt: Date; expiredAt: Date }
}

interface PhoneServiceOptions<
  TSignUpBodySchema extends BaseSignUpBodySchema = BaseSignUpBodySchema,
> {
  login?: {
    sessionExpiredInSeconds?: number // default to 3600 seconds (1 hour)
    hashPassword?: (password: string) => Promise<string>
    verifyPassword?: (password: string, hashed: string) => Promise<boolean>
  }
  signUp: {
    autoLogin?: boolean // default to true
    body: TSignUpBodySchema
    onOtpSent: (data: OnOtpSentArgs) => Promise<OnOtpSentReturn>
    onOtpVerify?: (
      data: OnOtpVerification<SignUpVerificationPayload<z.output<TSignUpBodySchema>>>
    ) => Promise<boolean>
  }
  changePhone?: {
    onOtpSent: (data: OnOtpSentArgs) => Promise<OnOtpSentReturn>
    onOtpVerify?: (
      data: OnOtpVerification<ChangePhoneNumberVerificationPayload>
    ) => Promise<boolean>
  }
  forgotPassword?: {
    onOtpSent: (data: OnOtpSentArgs) => Promise<OnOtpSentReturn>
    onOtpVerify?: (data: OnOtpVerification<ForgotPasswordVerificationPayload>) => Promise<boolean>
  }
}

export class PhoneService<
  TContext extends AnyContextable,
  TSchema extends ObjectWithOnlyValue<PluginSchema, any>,
  TSignUpBodySchema extends BaseSignUpBodySchema,
  TStore extends PhoneStore<TSignUpBodySchema>,
> {
  private readonly options: PhoneServiceOptions<TSignUpBodySchema>

  constructor(
    public readonly context: TContext,
    public readonly schema: TSchema,
    options: ValidateSchema<PluginSchema, TSchema, PhoneServiceOptions<TSignUpBodySchema>>,
    private readonly store: TStore
  ) {
    const defaultOptions = {
      login: {
        sessionExpiredInSeconds: 3600,
        hashPassword: Password.hashPassword,
        verifyPassword: Password.verifyPassword,
      },
      signUp: {
        onOtpVerify: async (data) => {
          return data.pin === data.verification.value.pin
        },
      },
      changePhone: {
        onOtpVerify: async (data) => {
          return data.pin === data.verification.value.pin
        },
      },
      forgotPassword: {
        onOtpVerify: async (data) => {
          return data.pin === data.verification.value.pin
        },
      },
    } satisfies PartialDeep<PhoneServiceOptions>

    this.options = defu(options, defaultOptions) as PhoneServiceOptions<TSignUpBodySchema>
  }

  getOptions(): PhoneServiceOptions<TSignUpBodySchema> {
    return this.options
  }

  async createSession(userId: string) {
    return this.store
      .createSession(userId)
      .then((result) => ok(result))
      .catch((error) => err(error))
  }

  async login(body: { phone: string; password: string }) {
    const user = await this.store.getUserByPhone(body.phone)

    if (!user) {
      return err({ message: 'Invalid password or user not found' })
    }

    const accounts = await this.store.getAccountByUserId(user.id)
    const credentialAccount = accounts.find((a) => a.provider === AccountProvider.CREDENTIAL)

    if (!credentialAccount || !credentialAccount.password) {
      return err({ message: 'Invalid password or user not found' })
    }

    // NOTE: verifyPassword function is default from options, can be customized
    const verifyStatus = await this.options.login!.verifyPassword!(
      body.password,
      credentialAccount.password as string
    )
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (verifyStatus.isErr()) {
      return err({ message: 'Internal Server Error', cause: verifyStatus.error })
    }

    if (!verifyStatus.value) {
      return err({ message: 'Invalid password or user not found' })
    }

    const session = await this.createSession(user.id)

    if (session.isErr()) {
      return err({ message: 'Failed to create session', cause: session.error })
    }

    return ok(session.value)
  }

  async sendSignUpPhoneOtp(data: z.output<TSignUpBodySchema>) {
    if (!this.options.signUp.onOtpSent) {
      return err({
        code: 'FEATURE_NOT_ENABLED' as const,
        message: 'Sign Up OTP feature is not enabled',
      })
    }

    const checkExists = await this.store.checkIfUserExists(data)

    if (checkExists) {
      return err({
        code: 'USER_ALREADY_EXISTS' as const,
        message: 'Email or Phone already exists',
      })
    }

    const count = await this.store.countActiveSignUpVerifications(data.phone)

    // TODO: Customizable
    // Check if the given phone number has reached the maximum OTP send limit
    if (count >= 5) {
      return err({
        code: 'REACHED_MAX_ATTEMPTS' as const,
        message: 'Maximum OTP send limit reached. Please try again later.',
      })
    }

    // Send phone verification OTP
    const otpResponse = await this.options.signUp
      .onOtpSent({ phone: data.phone, name: data.name })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (otpResponse.isErr()) {
      return err({
        code: 'FAILED_TO_SEND_OTP' as const,
        message: 'Failed to send OTP',
        cause: otpResponse.error,
      })
    }

    // NOTE: Hash function is default from options, can be customized
    const hashedPassword = await this.options.login!.hashPassword!(data.password)

    const { password: _, ...rest } = data

    const result = await this.store
      .createSignUpVerification({
        id: otpResponse.value.token,
        refCode: otpResponse.value.refCode,
        value: {
          phone: data.phone,
          password: hashedPassword,
          data: rest as z.output<TSignUpBodySchema>,
          attempt: 0,
          pin: otpResponse.value.pin,
        },
        // TODO: Check the expiration time from config
        expiredAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (result.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'Failed to create sign up verification',
        cause: result.error,
      })
    }

    return ok({
      token: otpResponse.value.token,
      refCode: otpResponse.value.refCode,
      resendAttempt: count + 1,
      submitAttempt: 0,
    })
  }

  async verifySignUpPhoneOtp(data: { phone: string; token: string; refCode: string; pin: string }) {
    const verificationResult = await this.store
      .getSignUpVerification(data.token)
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (verificationResult.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'Failed to get sign up verification',
      })
    }

    const verification = verificationResult.value

    if (!verification) {
      return err({
        code: 'INVALID_OR_EXPIRED_VERIFICATION_TOKEN' as const,
        message: 'Invalid or expired verification token',
      })
    }

    // TODO: Customizable
    if (verification.value.attempt >= 5) {
      return err({
        code: 'REACHED_MAX_ATTEMPTS' as const,
        message: 'Maximum OTP verification attempts reached',
      })
    }

    // NOTE: signUp.onOtpVerify function is default from options, can be customized
    const verifyStatus = await this.options.signUp!.onOtpVerify!({
      phone: data.phone,
      token: verification.id,
      pin: data.pin,
      verification,
    })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (verifyStatus.isErr()) {
      return err({
        code: 'FAILED_TO_VERIFY_OTP' as const,
        message: 'Failed to verify OTP',
        cause: verifyStatus.error,
      })
    }

    if (verifyStatus.value === false) {
      const attempt = await this.store
        .increaseSignUpVerificationAttempt(data.token)
        .then((result) => ok(result))
        .catch((error) => err(error))

      if (attempt.isErr())
        return err({
          code: 'INTERNAL_SERVER_ERROR' as const,
          message: 'Failed to increase verification attempt',
          cause: attempt.error,
        })

      return err({
        code: 'INVALID_OTP' as const,
        message: 'Invalid OTP',
        attempt: attempt.value,
      })
    }

    const userIdResult = await this.store
      .createUser(verification.value.data)
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (userIdResult.isErr()) {
      return err({
        code: 'FAILED_TO_CREATE_USER' as const,
        message: 'Failed to create user',
        cause: userIdResult.error,
      })
    }

    {
      const result = await this.store
        .createAccount(userIdResult.value, verification.value.password)
        .then((result) => ok(result))
        .catch((error) => err(error))

      if (result.isErr()) {
        return err({
          code: 'INTERNAL_SERVER_ERROR' as const,
          message: 'Failed to create account',
          cause: result.error,
        })
      }
    }

    {
      const result = await this.store
        .deleteSignUpVerification(data.phone)
        .then((result) => ok(result))
        .catch((error) => err(error))

      if (result.isErr()) {
        return err({
          code: 'INTERNAL_SERVER_ERROR' as const,
          message: 'Failed to delete verification record',
          cause: result.error,
        })
      }
    }

    return ok({ userId: userIdResult.value })
  }

  async sendChangePhoneNumberOtp(userId: string, phone: { new: string; old: string }) {
    if (!this.options.changePhone?.onOtpSent) {
      return err({
        code: 'FEATURE_NOT_ENABLED' as const,
        message: 'Change Phone Number feature is not enabled',
      })
    }

    const [existingUser, userWithPhone, count] = await Promise.all([
      this.store.getUserById(userId),
      this.store.getUserByPhone(phone.new),
      this.store.countActiveChangePhoneNumberVerification(userId),
    ])

    if (!existingUser) {
      return err({
        code: 'USER_NOT_FOUND' as const,
        message: 'User not found',
      })
    }

    if (existingUser.phone !== phone.old) {
      return err({
        code: 'CURRENT_PHONE_AND_OLD_PHONE_IS_NOT_THE_SAME' as const,
        message: 'Current phone number does not match the provided old phone number',
      })
    }

    if (existingUser.phone === phone.new) {
      return err({
        code: 'NEW_PHONE_AND_PHONE_IS_THE_SAME' as const,
        message: 'New phone number is the same as the current one',
      })
    }

    if (userWithPhone) {
      return err({
        code: 'PHONE_ALREADY_EXISTS' as const,
        message: 'Phone number already exists',
      })
    }

    // TODO: Customizable
    if (count >= 5) {
      return err({
        code: 'REACHED_MAX_ATTEMPTS' as const,
        message: 'Maximum OTP send limit reached. Please try again later.',
      })
    }

    const otpResponse = await this.options.changePhone
      .onOtpSent({ phone: phone.new, name: existingUser.name })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (otpResponse.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'Failed to send OTP',
        cause: otpResponse.error,
      })
    }

    await this.store.createChangePhoneNumberVerification({
      id: otpResponse.value.token,
      refCode: otpResponse.value.refCode,
      value: {
        userId: existingUser.id,
        oldPhone: phone.old,
        newPhone: phone.new,
        attempt: 0,
        pin: otpResponse.value.pin,
      },
      // TODO: Customizable
      expiredAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    })

    return ok({
      token: otpResponse.value.token,
      refCode: otpResponse.value.refCode,
      resendAttempt: count + 1,
    })
  }

  async verifyChangePhoneNumberOtp(
    userId: string,
    payload: { token: string; refCode: string; pin: string }
  ) {
    if (!this.options.changePhone?.onOtpVerify) {
      return err({
        code: 'FEATURE_NOT_ENABLED' as const,
        message:
          'Change Phone Number feature is not enabled. Please provide "changePhone.onOtpVerify"',
      })
    }

    const verificationResult = await this.store
      .getChangePhoneNumberVerification(payload.token)
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (verificationResult.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'Failed to get change phone number verification',
        cause: verificationResult.error,
      })
    }

    const verification = verificationResult.value

    if (!verification) {
      return err({
        code: 'INVALID_OR_EXPIRED_VERIFICATION_TOKEN' as const,
        message: 'Invalid or expired verification token',
      })
    }

    if (verification.value.userId !== userId) {
      return err({
        code: 'VERIFICATION_DOES_NOT_BELONGS_TO_USER' as const,
        message: 'This verification does not belong to the user',
      })
    }

    if (verification.id !== payload.token) {
      return err({
        code: 'INVALID_OR_EXPIRED_VERIFICATION_TOKEN' as const,
        message: 'Invalid or expired verification token',
      })
    }

    // TODO: Customizable
    if (verification.value.attempt >= 5) {
      return err({
        code: 'REACHED_MAX_ATTEMPTS' as const,
        message: 'Maximum OTP verification attempts reached',
      })
    }

    const verifyStatus = await this.options.changePhone
      .onOtpVerify({
        phone: verification.value.newPhone,
        pin: payload.pin,
        token: verification.id,
        verification,
      })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (verifyStatus.isErr()) {
      return err({
        code: 'FAILED_TO_VERIFY_OTP' as const,
        message: 'Failed to verify OTP',
        cause: verifyStatus.error,
      })
    }

    if (verifyStatus.value === false) {
      const attempt = await this.store
        .increaseChangePhoneNumberVerificationAttempt(payload.token)
        .then((result) => ok(result))
        .catch((error) => err(error))

      if (attempt.isErr()) {
        return err({
          code: 'INTERNAL_SERVER_ERROR' as const,
          message: 'Failed to increase verification attempt',
          cause: attempt.error,
        })
      }

      return err({
        code: 'INVALID_OTP' as const,
        message: 'Invalid OTP',
        attempt: attempt.value,
      })
    }

    {
      const result = await this.store
        .updatePhoneNumber(userId, verification.value.newPhone)
        .then((result) => ok(result))
        .catch((error) => err(error))

      if (result.isErr()) {
        return err({
          code: 'INTERNAL_SERVER_ERROR' as const,
          message: 'Failed to update phone number',
          cause: result.error,
        })
      }
    }

    {
      const result = await this.store
        .deleteChangePhoneNumberVerification(userId)
        .then((result) => ok(result))
        .catch((error) => err(error))

      if (result.isErr()) {
        return err({
          code: 'INTERNAL_SERVER_ERROR' as const,
          message: 'Failed to delete verification record',
          cause: result.error,
        })
      }
    }

    return ok({
      message: 'OTP verified successfully',
    })
  }

  async sendForgotPasswordOtp(phone: string) {
    if (!this.options.forgotPassword?.onOtpSent) {
      return err({
        code: 'FEATURE_NOT_ENABLED' as const,
        message: 'Forgot Password feature is not enabled',
      })
    }

    const existingUser = await this.store.getUserByPhone(phone)

    if (!existingUser) {
      // Random error message to prevent user enumeration
      const token = crypto.randomUUID()
      const refCode = Math.random().toString(36).substring(2, 6)
      return ok({
        token: token,
        refCode: refCode,
        resendAttempt: 1,
      })
    }

    const count = await this.store.countActiveForgotPasswordVerifications(phone)

    // TODO: Customizable
    if (count >= 5) {
      return err({
        code: 'REACHED_MAX_ATTEMPTS' as const,
        message: 'Maximum OTP send limit reached. Please try again later.',
      })
    }

    const otpResponse = await this.options.forgotPassword
      .onOtpSent({ phone: phone, name: existingUser.name })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (otpResponse.isErr()) {
      return err({
        code: 'FAILED_TO_SEND_OTP' as const,
        message: 'Failed to send OTP',
        cause: otpResponse.error,
      })
    }

    const token = await this.store
      .createForgotPasswordVerification({
        id: otpResponse.value.token,
        refCode: otpResponse.value.refCode,
        value: {
          phone: phone,
          attempt: 0,
          userId: existingUser.id,
          pin: otpResponse.value.pin,
        },
        // TODO: Customizable
        expiredAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (token.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'Failed to create forgot password verification',
        cause: token.error,
      })
    }

    return ok({
      token: token.value,
      refCode: otpResponse.value.refCode,
      resendAttempt: count + 1,
    })
  }

  async verifyForgotPasswordOtp(payload: {
    phone: string
    token: string
    refCode: string
    pin: string
  }) {
    if (!this.options.forgotPassword) {
      return err({
        code: 'FEATURE_NOT_ENABLED' as const,
        message: 'Forgot Password feature is not enabled',
      })
    }

    const verificationResult = await this.store
      .getForgotPasswordVerification(payload.token)
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (verificationResult.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'Failed to get forgot password verification',
        cause: verificationResult.error,
      })
    }

    const verification = verificationResult.value

    if (!verification) {
      return err({
        code: 'INVALID_OR_EXPIRED_VERIFICATION_TOKEN' as const,
        message: 'Invalid or expired verification token',
      })
    }

    if (verification.value.attempt >= 5) {
      return err({
        code: 'REACHED_MAX_ATTEMPTS' as const,
        message: 'Maximum OTP verification attempts reached',
      })
    }

    // NOTE: forgotPassword.onOtpVerify function is default from options, can be customized
    const verifyStatus = await this.options.forgotPassword!.onOtpVerify!({
      phone: payload.phone,
      pin: payload.pin,
      token: verification.id,
      verification,
    })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (verifyStatus.isErr()) {
      return err({
        code: 'FAILED_TO_VERIFY_OTP' as const,
        message: 'Failed to verify OTP',
        cause: verifyStatus.error,
      })
    }

    if (verifyStatus.value === false) {
      const attempt = await this.store
        .increaseForgotPasswordVerificationAttempt(payload.token)
        .then((result) => ok(result))
        .catch((error) => err(error))

      if (attempt.isErr()) {
        return err({
          code: 'INTERNAL_SERVER_ERROR' as const,
          message: 'Failed to increase forgot password verification attempt',
          cause: attempt.error,
        })
      }

      return err({
        code: 'INVALID_OTP' as const,
        message: 'Invalid OTP',
        attempt: attempt.value,
      })
    }

    const accountIdResult = await this.store
      .getCredentialAccountIdByUserId(verification.value.userId)
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (accountIdResult.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'Failed to get account ID',
        cause: accountIdResult.error,
      })
    }

    if (!accountIdResult.value) {
      return err({
        code: 'ACCOUNT_NOT_FOUND' as const,
        message: 'Account not found',
      })
    }

    const resetPasswordVerification = await this.store
      .createResetPasswordVerification({
        value: { accountId: accountIdResult.value },
        // TODO: Customizable
        expiredAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (resetPasswordVerification.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'Failed to create reset password verification',
        cause: resetPasswordVerification.error,
      })
    }

    const deleteResult = await this.store
      .deleteForgotPasswordVerification(payload.phone)
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (deleteResult.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'Failed to delete forgot password verification',
        cause: deleteResult.error,
      })
    }

    return ok({ token: resetPasswordVerification.value })
  }

  async resetPassword(payload: { token: string; password: string }) {
    const verification = await this.store.getResetPasswordVerification(payload.token)

    if (!verification) {
      return err({
        code: 'INVALID_OR_EXPIRED_VERIFICATION_TOKEN' as const,
        message: 'Invalid or expired verification token',
      })
    }

    // NOTE: Hash function is default from options, can be customized
    const hashedPassword = await this.options.login!.hashPassword!(payload.password)
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (hashedPassword.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'Failed to hash password',
        cause: hashedPassword.error,
      })
    }

    const accountId = verification.value.accountId

    const updateResult = await this.store
      .updateAccountPassword(verification.value.accountId, hashedPassword.value)
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (updateResult.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'Failed to update password',
        cause: updateResult.error,
      })
    }

    const deleteResult = await this.store
      .deleteResetPasswordVerification(accountId)
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (deleteResult.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'Internal Server Error. Please see logs for more details',
        cause: deleteResult.error,
      })
    }

    return ok(null)
  }
}
