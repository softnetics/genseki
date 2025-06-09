'use client'

import type { ReactNode } from 'react'
import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form'

import { redirect } from 'next/navigation'

import { SubmitButton } from '../../components/submit-button'
import { Form, FormField, FormItemController } from '../../intentui/ui/form'
import { useServerFunction } from '../../providers/root'

interface UpdateClientViewProps {
  identifer: string
  slug: string
  inputFields: {
    name: string
    label?: string
    description?: string
    placeholder?: string
    input: ReactNode
  }[]
  defaultValues?: Record<string, any>
}

export function UpdateClientView(props: UpdateClientViewProps) {
  const form = useForm({
    defaultValues: props.defaultValues,
  })
  const serverFunction = useServerFunction()

  const w = form.watch()

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const result = await serverFunction({
      method: `${props.slug}.update`,
      body: data,
      headers: {},
      pathParams: { id: props.identifer },
      query: {},
    })

    if (result.status === 200) {
      console.log('Update successful:', result.body)
      redirect(`../`) // Redirect to the list page
    } else {
      // Handle error, e.g., show an error message
      console.error('Update failed:', result.body)
    }
  }

  const onError: SubmitErrorHandler<any> = (error: any) => {
    console.error('Form submission error:', error)
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-y-4 mt-16"
      >
        {props.inputFields.map((input) => (
          <FormField
            key={input.name}
            name={input.name}
            control={form.control}
            render={({ field, fieldState, formState }) => (
              <FormItemController field={field} fieldState={fieldState} formState={formState}>
                {input.input}
              </FormItemController>
            )}
          />
        ))}
        <SubmitButton>Update</SubmitButton>
      </form>
      {JSON.stringify(w, null, 2)}
    </Form>
  )
}
