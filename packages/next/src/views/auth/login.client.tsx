'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

import { SubmitButton } from '../../components/submit-button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../intentui/ui/form'
import { Link } from '../../intentui/ui/link'
import { TextField } from '../../intentui/ui/text-field'
import { useServerFunction } from '../../providers/root'

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  // TODO: custom password validation
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Za-z]/, { message: 'Must contain English letters (A-Z, a-z)' })
    .regex(/[0-9]/, { message: 'Must contain numbers (0-9)' })
    .trim(),
})

export function LoginClientForm() {
  const serverFunction = useServerFunction()

  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  async function login(data: z.infer<typeof schema>) {
    form.clearErrors('email')
    form.clearErrors('password')
    const response = await serverFunction({
      method: 'auth.loginEmail',
      body: {
        email: data.email,
        password: data.password,
      },
      headers: {},
      query: {},
      pathParams: {},
    })

    if (response.status !== 200) {
      toast.error('Login failed', {
        description: response.body.status || 'Failed to login',
      })
      form.setError('email', {
        type: 'manual',
        message: response.body.status || 'Failed to login',
      })

      return
    }

    toast.success('Login successful', {
      description: 'You have successfully logged in.',
    })

    redirect('../collections')
  }

  return (
    <Form {...form}>
      <form className="flex flex-col space-y-8 flex-1" onSubmit={form.handleSubmit(login)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField
                  {...field}
                  name="email"
                  type="email"
                  placeholder="email..."
                  label="Email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField
                  {...field}
                  name="password"
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
        <Link href="./forgot-password" intent="primary" className="text-sm ml-auto">
          Forgot Password?
        </Link>
        <SubmitButton>Login</SubmitButton>
        <Link href="./sign-up" intent="primary" className="text-sm mx-auto">
          Create an account?
        </Link>
      </form>
    </Form>
  )
}
