'use client'

import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import z from 'zod/v4'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '../../../../../components'

const otpSchema = z.object({
  otp: z.string().regex(/^[0-9]{6}$/, { error: 'OTP code must be 6 digits' }),
})

export type OutputOtpForm = z.infer<typeof otpSchema>

export function InputOtpSection({ onSuccess }: { onSuccess: () => void }) {
  const form = useForm<OutputOtpForm>({
    resolver: standardSchemaResolver(otpSchema),
    mode: 'onChange',
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {
          // await api.verifyOtp(...)
          onSuccess()
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP maxLength={6} className="!h-[100px] w-full" {...field}>
                  <InputOTPGroup className="flex w-full flex-row justify-between">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="h-[50px] w-[50px]" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="primary" type="submit" className="w-full" size="sm">
          Next
        </Button>
      </form>
    </Form>
  )
}
