'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import z from 'zod'

import { Button } from '~/intentui/ui/button'
import { Label } from '~/intentui/ui/field'
import { Form, FormField, FormItem, FormMessage } from '~/intentui/ui/form'
import { TextField } from '~/intentui/ui/text-field'

import { LeftPanel } from '../_components/left-panel'
import { TermAndPrivacy } from '../_components/term-and-privacy'

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: '❌ Password must be at least 8 characters long' })
      .regex(/[A-Za-z]/, { message: '❌ Must contain English letters (A-Z, a-z)' })
      .regex(/[0-9]/, { message: '❌ Must contain numbers (0-9)' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ResetPasswordInput = z.input<typeof formSchema>
type ResetPasswordOutput = z.output<typeof formSchema>

export const ResetPasswordConfirmPage: NextPage = () => {
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''

  const form = useForm<ResetPasswordInput, any, ResetPasswordOutput>({
    resolver: zodResolver(formSchema),
    mode: 'all',
  })

  const { handleSubmit, control } = form

  const handleResetPassword = async (data: ResetPasswordInput) => {
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
                      <TextField {...field} type="password" placeholder="New Password" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <TextField {...field} type="password" placeholder="Confirm New Password" />
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
