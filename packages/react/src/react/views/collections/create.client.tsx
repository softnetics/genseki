'use client'

import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { getDefaultValueFromFieldsClient } from '../../../core'
import type { FieldsClient } from '../../../core/field'
import { Form } from '../../components'
import { AutoField } from '../../components/compound/auto-field/client'
import { SubmitButton } from '../../components/compound/submit-button'
import { useNavigation } from '../../providers'
import { useServerFunction, useStorageAdapter } from '../../providers/root'

interface CreateClientViewProps {
  slug: string
  fields: FieldsClient
  optionsRecord: Record<string, any[]>
}

export function CreateClientView(props: CreateClientViewProps) {
  const serverFunction = useServerFunction()
  const { navigate } = useNavigation()
  const storageAdapter = useStorageAdapter()

  const form = useForm({
    defaultValues: getDefaultValueFromFieldsClient(props.fields, storageAdapter),
  })

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const result = await serverFunction(`${props.slug}.create`, {
      body: data,
      headers: {},
      pathParams: {},
      query: {},
    })

    if (result.status === 200) {
      toast.success('Creation successfully')
      return navigate(`./`)
    } else {
      const description =
        typeof result.body === 'object' &&
        !!result.body &&
        'message' in result.body &&
        typeof result.body.message === 'string'
          ? result.body.message
          : 'Failed to create'
      toast.error('Failed to create', {
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
        {Object.values(props.fields.shape).map((fieldShape) => (
          <AutoField
            key={fieldShape.$client.fieldName}
            fieldShape={fieldShape}
            optionsRecord={props.optionsRecord}
          />
        ))}
        <SubmitButton>Create</SubmitButton>
      </form>
    </Form>
  )
}
