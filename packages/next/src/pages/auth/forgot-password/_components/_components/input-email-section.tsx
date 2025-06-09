'use client'

import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import z from 'zod/v4'

import { Button } from '../../../../../intentui/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../../../../../intentui/ui/form'
import { TextField } from '../../../../../intentui/ui/text-field'

const schema = z.object({
  email: z.email({ error: 'Invalid email address' }),
})

export type OutputEmailForm = z.infer<typeof schema>

interface InputEmailSectionProps {
  onNext: (email: string) => void
}

export function InputEmailSection({ onNext }: InputEmailSectionProps) {
  const form = useForm<OutputEmailForm>({
    resolver: standardSchemaResolver(schema),
    mode: 'onChange',
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
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
              <FormControl>
                <TextField {...field} placeholder="อีเมล" />
              </FormControl>
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
