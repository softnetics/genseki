'use client'

import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import z from 'zod/v4'

import { Button } from '../../../../../intentui/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../../../../../intentui/ui/form'
import { TextField } from '../../../../../intentui/ui/text-field'

const schema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, { error: 'เบอร์โทรศัพท์ไม่ถูกต้อง' }),
})

export type OutputPhoneForm = z.output<typeof schema>

interface InputPhoneSectionProps {
  onNext: (phone: string) => void
}

export function InputPhoneSection({ onNext }: InputPhoneSectionProps) {
  const form = useForm<OutputPhoneForm>({
    resolver: standardSchemaResolver(schema),
    mode: 'onChange',
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {
          // await api.sendOtp(phone)
          onNext(form.getValues('phone'))
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextField {...field} placeholder="เบอร์โทรศัพท์" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="primary" type="submit" className="w-full" size="sm">
          ส่งรหัส OTP
        </Button>
      </form>
    </Form>
  )
}
