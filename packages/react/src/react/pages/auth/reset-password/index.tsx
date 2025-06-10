'use client'

import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import z from 'zod/v4'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Label,
  Link,
  TextField,
} from '../../../components'
import { LeftPanel } from '../_components/left-panel'
import { TermAndPrivacy } from '../_components/term-and-privacy'

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters long' })
      .regex(/[A-Za-z]/, { error: 'Must contain English letters (A-Z, a-z)' })
      .regex(/[0-9]/, { error: 'Must contain numbers (0-9)' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ResetPasswordOutput = z.output<typeof formSchema>

export const ResetPasswordConfirmPage = (props: { searchParams: Record<string, string> }) => {
  const phone = props.searchParams['phone'] || ''

  const form = useForm<ResetPasswordOutput>({
    resolver: standardSchemaResolver(formSchema),
    mode: 'all',
  })

  const { handleSubmit, control } = form

  const handleResetPassword = async (data: ResetPasswordOutput) => {
    // TODO: Call API to reset password here
    console.log('Resetting password for phone:', phone)
    console.log('New password:', data.password)
  }

  return (
    <div className="flex min-h-screen">
      <LeftPanel />

      <div className="relative flex w-full items-center justify-center p-6 md:w-1/2">
        <div className="flex h-full w-full max-w-sm flex-col space-y-6">
          <div className="absolute right-16 top-16 text-right text-sm">
            <Link href="./login" className="text-muted-foreground text-md hover:underline">
              Back to Login
            </Link>
          </div>
          <div className="my-auto flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Reset Password</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Please set a new password to access your account.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={handleSubmit(handleResetPassword)}
                className="flex w-full flex-col gap-4"
              >
                <Label />
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TextField {...field} type="password" placeholder="New Password" />
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
                        <TextField {...field} type="password" placeholder="Confirm New Password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="primary" size="sm" className="w-full" type="submit">
                  Confirm Password Reset
                </Button>
              </form>
            </Form>
            <TermAndPrivacy />
          </div>
        </div>
      </div>
    </div>
  )
}
