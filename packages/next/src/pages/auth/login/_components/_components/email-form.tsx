'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import z from 'zod'

import { Button } from '~/intentui/ui/button'
import { Form, FormField, FormItem, FormMessage } from '~/intentui/ui/form'
import { TextField } from '~/intentui/ui/text-field'

const emailFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string(),
})

type EmailLoginFormInput = z.input<typeof emailFormSchema>
type EmailLoginFormOutput = z.output<typeof emailFormSchema>

interface RightPanelProps {
  action: (formData: FormData) => Promise<any>
}

export function EmailLoginForm({ action }: RightPanelProps) {
  const emailForm = useForm<EmailLoginFormInput, any, EmailLoginFormOutput>({
    resolver: zodResolver(emailFormSchema),
    mode: 'onChange',
  })

  const { handleSubmit: emailHandleSubmit, control: emailControl } = emailForm

  const onLoginWithEmail = async (data: EmailLoginFormOutput) => {
    console.log('Email login data:', data)
    // TODO: call email login API
  }

  return (
    <Form {...emailForm}>
      <form onSubmit={emailHandleSubmit(onLoginWithEmail)} className="flex flex-col gap-4">
        <FormField
          control={emailControl}
          name="email"
          render={({ field }) => (
            <FormItem>
              <TextField {...field} placeholder="name@example.com" label="email" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={emailControl}
          name="password"
          render={({ field }) => (
            <FormItem>
              <TextField {...field} type="password" placeholder="Password" label="password" />
              <FormMessage />
              <div className="mt-1 text-right">
                <Link href="./forgot-password" className="text-primary text-sm hover:underline">
                  Forgot password?
                </Link>
              </div>
            </FormItem>
          )}
        />
        <Button size="sm" variant="primary" className="w-full" type="submit">
          Sign In with Email
        </Button>
      </form>
    </Form>
  )
}
