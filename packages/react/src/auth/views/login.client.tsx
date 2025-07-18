'use client'

import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { toast } from 'sonner'
import { z } from 'zod'

import { SubmitButton } from '../../react/components/compound/submit-button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Link,
  TextField,
} from '../../react/components/primitives'
import { useNavigation } from '../../react/providers/navigation'
import { useServerFunction } from '../../react/providers/root'

const FormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  // TODO: custom password validation
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Za-z]/, { message: 'Must contain English letters (A-Z, a-z)' })
    .regex(/[0-9]/, { message: 'Must contain numbers (0-9)' })
    .trim(),
})

type FormSchema = z.infer<typeof FormSchema>

export function LoginClientForm() {
  const serverFunction = useServerFunction()

  const form = useForm<FormSchema>({
    resolver: standardSchemaResolver(FormSchema),
    mode: 'onSubmit',
  })
  const { navigate } = useNavigation()

  async function login(data: z.infer<typeof FormSchema>) {
    form.clearErrors('email')
    form.clearErrors('password')
    const response = await serverFunction('auth.loginEmail', {
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
        // description: response.body.status || 'Failed to login',
        description: 'Failed to login',
      })
      form.setError('email', {
        type: 'manual',
        // message: response.body.status || 'Failed to login',
        message: 'Failed to login',
      })

      return
    }

    toast.success('Login successful', {
      description: 'You have successfully logged in.',
    })

    navigate('../collections')
  }

  return (
    <div className="flex flex-col space-y-8">
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
        </form>
      </Form>
      <Link href="./sign-up" intent="primary" className="text-sm mx-auto">
        Create an account?
      </Link>
    </div>
  )
}
