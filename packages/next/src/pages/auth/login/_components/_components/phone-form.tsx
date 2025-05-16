'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import z from 'zod'

import { Button } from '~/intentui/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/intentui/ui/form'
import { TextField } from '~/intentui/ui/text-field'

const phoneFormSchema = z.object({
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  password: z.string(),
})
type PhoneLoginFormOutput = z.output<typeof phoneFormSchema>

interface RightPanelProps {
  action: (formData: FormData) => Promise<any>
}

export function PhoneLoginForm({ action }: RightPanelProps) {
  const phoneForm = useForm({
    resolver: zodResolver(phoneFormSchema),
    mode: 'onChange',
  })
  const { handleSubmit: phoneHandleSubmit, control: phoneControl } = phoneForm
  const onLoginWithPhone = async (data: PhoneLoginFormOutput) => {
    const formData = new FormData()
    formData.append('phoneNumber', data.phoneNumber)
    formData.append('password', data.password)
    await action(formData)
  }

  return (
    <Form {...phoneForm}>
      <form onSubmit={phoneHandleSubmit(onLoginWithPhone)} className="flex flex-col gap-4">
        <FormField
          control={phoneControl}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField {...field} placeholder="Phone Number" label="phone number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={phoneControl}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField {...field} type="password" placeholder="Password" label="password" />
              </FormControl>
              <FormMessage />
              <div className="mt-1 text-right">
                <Link href="/forgot-password" className="text-primary text-sm hover:underline">
                  Forgot password?
                </Link>
              </div>
            </FormItem>
          )}
        />
        <Button size="sm" variant="primary" className="w-full" type="submit">
          Sign In with Phone
        </Button>
      </form>
    </Form>
  )
}
