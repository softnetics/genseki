'use client'

import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form'

import { toast } from 'sonner'

import type { FieldsClient } from '../../../core'
import { Form } from '../../components'
import { AutoField } from '../../components/compound/auto-field/client'
import { SubmitButton } from '../../components/compound/submit-button'
import { useNavigation } from '../../providers'
import { useServerFunction } from '../../providers/root'

interface UpdateClientViewProps {
  slug: string
  identifer: string
  fields: FieldsClient
  optionsRecord: Record<string, any[]>
  defaultValues?: Record<string, any>
}

export function UpdateClientView(props: UpdateClientViewProps) {
  const form = useForm({ defaultValues: props.defaultValues })
  const serverFunction = useServerFunction()
  const { navigate } = useNavigation()

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const result = await serverFunction({
      method: `${props.slug}.update`,
      body: data,
      headers: {},
      pathParams: { id: props.identifer },
      query: {},
    })

    if (result.status === 200) {
      toast.success('Updation successfully')
      return navigate(`../`)
    } else {
      console.log(result.body)
      const description = result.body?.message
      toast.error('Failed to update', {
        ...(description && { description }),
      })
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
        className="flex flex-col gap-y-8 mt-16"
      >
        {Object.values(props.fields).map((field) => (
          <AutoField
            key={field.fieldName}
            field={field}
            visibilityField="update"
            optionsRecord={props.optionsRecord}
          />
        ))}
        <SubmitButton>Update</SubmitButton>
      </form>
    </Form>
  )
}
