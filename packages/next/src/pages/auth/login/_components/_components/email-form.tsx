'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import z from 'zod'

import { Button } from '../../../../../intentui/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../../../../../intentui/ui/form'
import { TextField } from '../../../../../intentui/ui/text-field'

const emailFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string(),
})

type EmailLoginFormOutput = z.output<typeof emailFormSchema>

interface RightPanelProps {
  action: (formData: FormData) => Promise<any>
}

export function EmailLoginForm({ action }: RightPanelProps) {
  const emailForm = useForm({
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
              <FormControl>
                <TextField {...field} placeholder="name@example.com" label="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={emailControl}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField {...field} type="password" placeholder="Password" label="password" />
              </FormControl>
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
