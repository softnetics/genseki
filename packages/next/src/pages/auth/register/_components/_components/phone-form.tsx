'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import { Button } from '~/intentui/ui/button'
import { Form, FormField, FormItem, FormMessage } from '~/intentui/ui/form'
import { TextField } from '~/intentui/ui/text-field'

const phoneFormSchema = z
  .object({
    phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type PhoneRegisterInput = z.input<typeof phoneFormSchema>
type PhoneRegisterOutput = z.output<typeof phoneFormSchema>

export function PhoneRegisterForm() {
  const form = useForm<PhoneRegisterInput, any, PhoneRegisterOutput>({
    resolver: zodResolver(phoneFormSchema),
    mode: 'onChange',
  })

  const { handleSubmit, control } = form

  const onSubmit = async (data: PhoneRegisterInput) => {
    console.log('Phone register data:', data)
    // TODO: call phone register API
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <TextField {...field} placeholder="Phone Number" label="Phone Number" />
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
          Sign Up with Phone
        </Button>
      </form>
    </Form>
  )
}
