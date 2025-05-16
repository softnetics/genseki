'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import { Button } from '~/intentui/ui/button'
import { Form, FormField, FormItem, FormMessage } from '~/intentui/ui/form'
import { TextField } from '~/intentui/ui/text-field'

const formSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormInput = z.input<typeof formSchema>
type RegisterFormOutput = z.output<typeof formSchema>

export default function EmailRegisterForm() {
  const form = useForm<RegisterFormInput, any, RegisterFormOutput>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  })

  const { handleSubmit, control } = form

  const onSubmit = async (data: RegisterFormInput) => {
    console.log('Email register data:', data)
    // TODO: call email register API
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <TextField {...field} placeholder="Email" label="Email" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <TextField {...field} placeholder="Name" label="Name" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <TextField {...field} type="password" placeholder="Password" label="Password" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <TextField
                {...field}
                type="password"
                placeholder="Confirm Password"
                label="Confirm Password"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" variant="primary" className="w-full">
          Sign Up with Email
        </Button>
      </form>
    </Form>
  )
}
