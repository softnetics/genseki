'use client'

import { useForm } from 'react-hook-form'

import { toast } from 'sonner'

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

interface SignUpFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function SignUpClientForm() {
  const clientConfig = useClientConfig()
  const serverFunction = useServerFunction()
  const { navigate } = useNavigation()

  // TODO: Add validation
  const form = useForm<SignUpFormData>({})

  const onValid = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' })
      return
    }

    const response = await serverFunction({
      method: 'auth.signUp',
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
      // return
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
      <form
        className="flex flex-col space-y-8 flex-1"
        onSubmit={form.handleSubmit(onValid, (errors) => console.error(errors))}
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField {...field} placeholder="full name..." label="Full Name" />
              </FormControl>
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
          render={({ field, formState }) => (
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
