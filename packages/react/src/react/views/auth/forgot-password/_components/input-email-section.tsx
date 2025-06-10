'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  TextField,
} from '@genseki/react'

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
})

export type OutputEmailForm = z.infer<typeof schema>

interface InputEmailSectionProps {
  onNext: (email: string) => Promise<{
    status: number
    errormessage?: string
  }>
}

export function InputEmailSection({ onNext }: InputEmailSectionProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          const response = await onNext(data.email)
          // await api.sendOtpToEmail(data.email)
          if (response.status !== 200) {
            form.setError('email', {
              type: 'manual',
              message: response.errormessage || 'Failed to send OTP',
            })
            return
          }
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField {...field} placeholder="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="primary"
          type="submit"
          className="w-full"
          size="sm"
          onPress={() => form.clearErrors('email')}
        >
          Send OTP
        </Button>
      </form>
    </Form>
  )
}
