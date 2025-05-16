'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import { Button } from '~/intentui/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/intentui/ui/form'
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

type PhoneRegisterOutput = z.output<typeof phoneFormSchema>

export function PhoneRegisterForm() {
  const form = useForm({
    resolver: zodResolver(phoneFormSchema),
    mode: 'onChange',
  })

  const { handleSubmit, control } = form

  const onSubmit = async (data: PhoneRegisterOutput) => {
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
              <FormControl>
                <TextField {...field} placeholder="Phone Number" label="Phone Number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField {...field} type="password" placeholder="Password" label="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField
                  {...field}
                  type="password"
                  placeholder="Confirm Password"
                  label="Confirm Password"
                />
              </FormControl>
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
