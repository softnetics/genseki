'use client'

import type { ReactNode } from 'react'
import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form'

import { redirect } from 'next/navigation'

import { SubmitButton } from '../../components/submit-button'
import { Form, FormField, FormItemController } from '../../intentui/ui/form'
import { useServerFunction } from '../../providers/root'

interface CreateClientViewProps {
  slug: string
  inputFields: {
    name: string
    label?: string
    description?: string
    placeholder?: string
    input: ReactNode
  }[]
}

export function CreateClientView(props: CreateClientViewProps) {
  const form = useForm()
  const serverFunction = useServerFunction()

  // TODO: remove this
  const w = form.watch()

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const result = await serverFunction({
      method: `${props.slug}.create`,
      body: data,
      headers: {},
      pathParams: {},
      query: {},
    })

    if (result.status === 200) {
      console.log('Creation successful:', result.body)
      redirect(`./`) // Redirect to the created item
    } else {
      // Handle error, e.g., show an error message
      console.error('Creation failed:', result.body)
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
        <SubmitButton>Create</SubmitButton>
      </form>
      {/* TODO: Remove this */}
      {JSON.stringify(w, null, 2)}
    </Form>
  )
}
