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

import type { PhoneStore } from './store'
import type { BaseSignUpBodySchema, PluginSchema } from './types'
interface PhoneServiceOptions<
  TSignUpBodySchema extends BaseSignUpBodySchema = BaseSignUpBodySchema,
> {
  login?: {
    sessionExpiredInSeconds?: number // default to 3600 seconds (1 hour)
    hashPassword?: (password: string) => Promise<string>
    verifyPassword?: (password: string, hashed: string) => Promise<boolean>
  }
  signUp: {
    body: TSignUpBodySchema
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

const defaultOptions = {
  login: {
    sessionExpiredInSeconds: 3600,
    hashPassword: Password.hashPassword,
    verifyPassword: Password.verifyPassword,
  },
} satisfies PartialDeep<PhoneServiceOptions>

export type PhoneServiceOptionsWithDefaults = ReturnType<
  typeof defu<PhoneServiceOptions, [typeof defaultOptions]>
>

export class PhoneService<
  TContext extends AnyContextable,
  TSchema extends ObjectWithOnlyValue<PluginSchema, any>,
  TSignUpBodySchema extends BaseSignUpBodySchema,
  TStore extends PhoneStore<TSignUpBodySchema>,
> {
  private readonly options: PhoneServiceOptionsWithDefaults

  constructor(
    public readonly context: TContext,
    public readonly schema: TSchema,
    options: ValidateSchema<PluginSchema, TSchema, PhoneServiceOptions<TSignUpBodySchema>>,
    private readonly store: TStore
  ) {
    this.options = defu(options, defaultOptions) as PhoneServiceOptionsWithDefaults
  }

  get signUpBody(): TSignUpBodySchema {
    return this.options.signUp.body as TSignUpBodySchema
  }

  async login(body: { phone: string; password: string }) {
    const user = await this.store.getUserByPhone(body.phone)

    if (!user) {
      return err({ message: 'User not found' })
    }

    const accounts = await this.store.getAccountByUserId(user.id)
    const credentialAccount = accounts.find((a) => a.provider === AccountProvider.CREDENTIAL)

    if (!credentialAccount || !credentialAccount.password) {
      return err({ message: 'Account not found or password not set' })
    }

    const verifyStatus = await Password.verifyPassword(
      body.password,
      credentialAccount.password as string
    )

    if (!verifyStatus) {
      return err({ message: 'Invalid password' })
    }

    const session = await this.store.createSession(user.id)

    return ok(session)
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
        code: 'MAX_OTP_SEND_LIMIT_REACHED' as const,
        message: 'Maximum OTP send limit reached. Please try again later.',
      })
    }

    // Send phone verification OTP
    const otpResponse = await this.options.signUp
      .onOtpSent({
        phone: data.phone,
        name: data.name,
        refCode: await this.store.generateRefCode(),
      })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (otpResponse.isErr()) {
      return err({
        code: 'FAILED_TO_SEND_OTP' as const,
        message: 'Failed to send OTP',
        cause: otpResponse.error,
      })
    }

    const hashedPassword = await this.options.login.hashPassword(data.password)

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
        },
        // TODO: Check the expiration time from config
        expiredAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (result.isErr()) {
      return err({
        code: 'FAILED_TO_CREATE_VERIFICATION' as const,
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
    const verification = await this.store.getSignUpVerification(data.phone, data.refCode)

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

    const verifyStatus = await this.options.signUp
      .onOtpVerify({
        phone: data.phone,
        token: verification.id,
        pin: data.pin,
      })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (verifyStatus.isErr()) {
      return err({
        code: 'FAILED_OTP_VERIFICATION' as const,
        message: 'Failed to verify OTP',
        cause: verifyStatus.error,
      })
    }

    if (verifyStatus.value === false) {
      const attempt = await this.store
        .increaseSignUpVerificationAttempt(data.phone, data.refCode)
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

    const userId = await this.store.createUser(verification.value.data)
    await this.store.createAccount(userId, verification.value.password)

    return ok(null)
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
      this.store.countActiveChangePhoneNumberVerification(phone.old),
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
        code: 'PHONE_EXISTS' as const,
        message: 'Phone number already exists',
      })
    }

    // TODO: Customizable
    if (count >= 5) {
      return err({
        code: 'REACHED_MAX_OTP_SEND_LIMIT' as const,
        message: 'Maximum OTP send limit reached. Please try again later.',
      })
    }

    const refCode = await this.store.generateRefCode()

    const otpResponse = await this.options.changePhone
      .onOtpSent({
        phone: phone.new,
        name: existingUser.name,
        refCode: refCode,
      })
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
      },
      // TODO: Customizable
      expiredAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    })

    return ok({
      token: otpResponse.value.token,
      refCode: otpResponse.value.refCode,
      resendAttempt: count + 1,
      submitAttempt: 0,
      // TODO: penalty time
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

    const verification = await this.store.getChangePhoneNumberVerification(userId, payload.refCode)
    if (!verification) {
      return err({
        code: 'INVALID_OR_EXPIRED_VERIFICATION_TOKEN' as const,
        message: 'Invalid or expired verification token',
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
      })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (verifyStatus.isErr()) {
      return err({
        code: 'FAILED_OTP_VERIFICATION' as const,
        message: 'Failed to verify OTP',
        cause: verifyStatus.error,
      })
    }

    if (verifyStatus.value === false) {
      const attempt = await this.store
        .increaseChangePhoneNumberVerificationAttempt(userId, payload.refCode)
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
        submitAttempt: 0,
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
      .onOtpSent({
        phone: phone,
        name: existingUser.name,
        refCode: await this.store.generateRefCode(),
      })
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
        },
        // TODO: Customizable
        expiredAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      })
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (token.isErr()) {
      return err({
        code: 'FAILED_TO_CREATE_VERIFICATION' as const,
        message: 'Failed to create forgot password verification',
        cause: token.error,
      })
    }

    return ok({
      token: token.value,
      refCode: otpResponse.value.refCode,
      resendAttempt: count + 1,
      submitAttempt: 0,
      // TODO: Penalty time
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

    const verification = await this.store.getForgotPasswordVerification(
      payload.phone,
      payload.refCode
    )

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

    const verifyStatus = await this.options.forgotPassword
      .onOtpVerify({
        phone: payload.phone,
        pin: payload.pin,
        token: verification.id,
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
        .increaseForgotPasswordVerificationAttempt(payload.phone, payload.refCode)
        .then((result) => ok(result))
        .catch((error) => err(error))

      if (attempt.isErr()) {
        return err({
          code: 'FAILED_TO_INCREASE_ATTEMPT' as const,
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
    // TODO: Should we delete the verification
    const accountId = await this.store.getCredentialAccountIdByUserId(verification.value.userId)

    if (!accountId) {
      return err({
        code: 'ACCOUNT_NOT_FOUND' as const,
        message: 'Account not found',
      })
    }

    const resetPasswordVerification = await this.store.createResetPasswordVerification({
      value: { accountId: accountId },
      // TODO: Customizable
      expiredAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    })

    return ok({ token: resetPasswordVerification })
  }

  async resetPassword(payload: { token: string; password: { old: string; new: string } }) {
    const verification = await this.store.getResetPasswordVerification(payload.token)

    if (!verification) {
      return err({
        code: 'INVALID_OR_EXPIRED_VERIFICATION_TOKEN' as const,
        message: 'Invalid or expired verification token',
      })
    }

    const account = await this.store.getAccountById(verification.value.accountId)

    if (!account) {
      return err({
        code: 'ACCOUNT_NOT_FOUND' as const,
        message: 'Account not found',
      })
    }

    if (account.provider !== AccountProvider.CREDENTIAL) {
      return err({
        code: 'ACCOUNT_NOT_SUPPORTED' as const,
        message: 'This account does not support password login',
      })
    }

    const existingPassword = account.password

    if (!existingPassword) {
      return err({
        code: 'ACCOUNT_NOT_SUPPORTED' as const,
        message: 'This account does not need to change password',
      })
    }

    const oldPasswordVerification = await Password.verifyPassword(
      payload.password.old,
      existingPassword
    )
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (oldPasswordVerification.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'Old Password checking logic throw error. Please check the log for more details',
      })
    }

    if (!oldPasswordVerification.value) {
      return err({
        code: 'OLD_PASSWORD_INCORRECT' as const,
        message: 'Old password is incorrect',
      })
    }

    const newPasswordVerification = await Password.verifyPassword(
      payload.password.new,
      existingPassword
    )
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (newPasswordVerification.isErr()) {
      return err({
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: 'New Password checking logic throw error. Please check the log for more details',
      })
    }

    if (newPasswordVerification.value) {
      return err({
        code: 'NEW_PASSWORD_SAME_AS_OLD' as const,
        message: 'New password must be different from the old one',
      })
    }

    const accountId = verification.value.accountId
    const hashedPassword = await Password.hashPassword(payload.password.new)

    const updateResult = await this.store
      .updateAccountPassword(accountId, hashedPassword)
      .then((result) => ok(result))
      .catch((error) => err(error))

    if (updateResult.isErr()) {
      return err({
        code: 'FAILED_TO_UPDATE_PASSWORD' as const,
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
        code: 'FAILED_TO_DELETE_PASSWORD_VERIFICATION' as const,
        message: 'Internal Server Error. Please see logs for more details',
        cause: deleteResult.error,
      })
    }

    return ok(null)
  }
}
