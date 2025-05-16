'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import { Button } from '~/intentui/ui/button'
import { Form, FormField, FormItem, FormMessage } from '~/intentui/ui/form'
import { TextField } from '~/intentui/ui/text-field'

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
})

export type InputEmailForm = z.infer<typeof schema>
export type OutputEmailForm = z.infer<typeof schema>

interface InputEmailSectionProps {
  onNext: (email: string) => void
}

export function InputEmailSection({ onNext }: InputEmailSectionProps) {
  const form = useForm<InputEmailForm, any, OutputEmailForm>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          onNext(data.email)
          // await api.sendOtpToEmail(data.email)
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <TextField {...field} placeholder="อีเมล" />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="primary" type="submit" className="w-full" size="sm">
          ส่งรหัส OTP ไปยังอีเมล
        </Button>
      </form>
    </Form>
  )
}
