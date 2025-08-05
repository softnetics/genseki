'use client'

import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useRouter } from 'next/navigation'
import z from 'zod/v4'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  SubmitButton,
  TextField,
  toast,
} from '@genseki/react'

import { queryClient } from '../../client'

const FormSchema = z
  .object({
    name: z.string().min(1, { message: 'Full name is required' }).trim(),
    email: z.email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Za-z]/, { message: 'Must contain English letters (A-Z, a-z)' })
      .regex(/[0-9]/, { message: 'Must contain numbers (0-9)' })
      .trim(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type FormSchema = z.infer<typeof FormSchema>

export function SetupClientForm() {
  const router = useRouter()
  const form = useForm<FormSchema>({
    resolver: standardSchemaResolver(FormSchema),
  })

  const mutation = queryClient.useMutation('POST', '/auth/setup', {})

  const onValid = async (data: FormSchema) => {
    const response = await mutation.mutateAsync(
      { body: { name: data.name, email: data.email, password: data.password } },
      {
        onError: (error) => {
          console.error('Setup failed', error)
        },
      }
    )

    if (response.status !== 200) {
      toast.error('Setup failed')
      return
    }

    toast.success('Setup completed successfully')
    router.push('/admin/auth/login')
  }

  return (
    <Form {...form}>
      <form className="flex flex-col space-y-8 flex-1" onSubmit={form.handleSubmit(onValid)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField
                  {...field}
                  placeholder="full name..."
                  label="Full Name"
                  isDisabled={mutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField
                  {...field}
                  type="email"
                  placeholder="email..."
                  label="Email"
                  isDisabled={mutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField
                  {...field}
                  type="password"
                  placeholder="password..."
                  label="Password"
                  isRevealable
                  isDisabled={mutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField
                  {...field}
                  type="password"
                  placeholder="confirm password..."
                  label="Confirm Password"
                  isRevealable
                  isDisabled={mutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton pending={mutation.isPending}>Sign Up</SubmitButton>
      </form>
    </Form>
  )
}
