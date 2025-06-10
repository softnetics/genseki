'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { redirect } from 'next/navigation'
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
  Typography,
  useServerFunction,
} from '@genseki/react'

const formSchema = z
  .object({
    // TODO: custom password validation
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Za-z]/, { message: 'Must contain English letters (A-Z, a-z)' })
      .regex(/[0-9]/, { message: 'Must contain numbers (0-9)' })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

interface ResetPasswordClientFormProps {
  token?: string
  isErrorToken: boolean
}

export function ResetPasswordClientForm({ token, isErrorToken }: ResetPasswordClientFormProps) {
  const serverFunction = useServerFunction()

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'all',
  })

  const { handleSubmit, control } = form

  const handleResetPassword = async (data: z.infer<typeof formSchema>) => {
    const response = await serverFunction({
      method: 'auth.resetPasswordEmail',
      body: {
        password: data.password,
      },
      headers: {},
      query: { token },
      pathParams: {},
    })
    if (response.status !== 200) {
      toast.error('Failed to reset password', {
        description: response.body.status || 'Failed to reset password',
      })
      form.setError('password', {
        type: 'manual',
        message: response.body.status || 'Failed to reset password',
      })
      return
    }
    toast.success('Password reset successfully', {
      description: 'You can now log in with your new password.',
    })
    redirect('./login')
  }

  const onError = () => {
    toast.error('Failed to reset password', {
      description: 'Please fill out the form correctly.',
    })
  }

  return (
    <div className="p-12 md:p-16 flex-1 flex items-center justify-center mx-auto">
      <div className="flex flex-col flex-1 space-y-16 max-w-sm">
        <Typography type="h2" weight="semibold" className="text-center">
          Reset Password
        </Typography>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleResetPassword, onError)}
            className="flex flex-col space-y-8 flex-1"
          >
            <FormField
              control={control}
              name="password"
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
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextField
                      {...field}
                      type="password"
                      placeholder="confirmPassword..."
                      label="confirmPassword"
                      isRevealable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton>Reset Password</SubmitButton>
          </form>
        </Form>
      </div>
    </div>
  )
}
