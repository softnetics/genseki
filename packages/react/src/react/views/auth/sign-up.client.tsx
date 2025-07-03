'use client'

import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  SubmitButton,
  TextField,
} from '../../components'
import { useNavigation } from '../../providers'
import { useClientConfig, useServerFunction } from '../../providers/root'

const FormSchema = z
  .object({
    name: z.string().min(1, { message: 'Full name is required' }).trim(),
    email: z.string().email({ message: 'Invalid email address' }),
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

export function SignUpClientForm() {
  const clientConfig = useClientConfig()
  const serverFunction = useServerFunction()
  const { navigate } = useNavigation()

  const form = useForm<FormSchema>({
    resolver: standardSchemaResolver(FormSchema),
  })

  const onValid = async (data: FormSchema) => {
    const response = await serverFunction({
      method: 'auth.signUpEmail',
      body: data,
      headers: {},
      query: {},
      pathParams: {},
    })

    if (response.status !== 200) {
      toast.error('Failed to sign up', {
        description: response.body.status || 'Failed to sign up',
      })
      return
    }

    if (clientConfig.auth.ui.signUp.autoLogin) {
      const loginResponse = await serverFunction({
        method: 'auth.loginEmail',
        body: { email: data.email, password: data.password },
        headers: {},
        query: {},
        pathParams: {},
      })

      if (loginResponse.status !== 200) {
        toast.error('Failed to log in after sign up', {
          description: loginResponse.body.status || 'Failed to log in',
        })
        return
      }

      toast.success('Successfully signed up and logged in', {
        description: 'You are now logged in.',
      })

      return navigate('../collections')
    }

    toast.success('Successfully signed up', {
      description: 'You can now log in with your credentials.',
    })

    return navigate('../auth/sign-in')
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
                <TextField {...field} placeholder="full name..." label="Full Name" />
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
                <TextField {...field} type="email" placeholder="email..." label="Email" />
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton>Sign Up</SubmitButton>
      </form>
    </Form>
  )
}
