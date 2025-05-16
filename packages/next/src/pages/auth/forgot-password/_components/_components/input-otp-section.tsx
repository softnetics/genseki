'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import { Button } from '~/intentui/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/intentui/ui/form'
import { InputOTP } from '~/intentui/ui/input-otp'

const otpSchema = z.object({
  otp: z.string().regex(/^[0-9]{6}$/, { message: 'OTP code must be 6 digits' }),
})

export type OutputOtpForm = z.infer<typeof otpSchema>

export function InputOtpSection({ onSuccess }: { onSuccess: () => void }) {
  const form = useForm({
    resolver: zodResolver(otpSchema),
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
                  <InputOTP.Group className="flex w-full flex-row justify-between">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTP.Slot key={i} index={i} className="h-[50px] w-[50px]" />
                    ))}
                  </InputOTP.Group>
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
