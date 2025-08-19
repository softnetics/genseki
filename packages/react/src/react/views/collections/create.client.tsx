'use client'

import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getDefaultValueFromFieldsClient } from '../../../core'
import type { FieldsClient } from '../../../core/field'
import { Form } from '../../components'
import { AutoFields } from '../../components/compound/auto-field'
import { SubmitButton } from '../../components/compound/submit-button'
import { useNavigation } from '../../providers'
import { useStorageAdapter } from '../../providers/root'

interface CreateClientViewProps {
  slug: string
  fields: FieldsClient
}

export function CreateClientView(props: CreateClientViewProps) {
  const { navigate } = useNavigation()
  const storageAdapter = useStorageAdapter()

  const form = useForm({
    defaultValues: getDefaultValueFromFieldsClient(props.fields, storageAdapter),
  })

  const mutation = useMutation<{
    status: number
    body: { __pk: string; __id: string }
  }>({
    mutationKey: ['POST', `/${props.slug}`],
    mutationFn: async (data: any) => {
      // TODO: This should be provided from App Config
      const response = await fetch(`/api/${props.slug}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        let errorBody
        try {
          errorBody = await response.json()
        } catch (e) {
          errorBody = await response.text()
        }
        const errorMessage =
          typeof errorBody === 'object' && errorBody && errorBody.message
            ? errorBody.message
            : typeof errorBody === 'string' && errorBody
              ? errorBody
              : 'Failed to create'
        throw new Error(
          `Failed to create (status: ${response.status})${errorMessage ? `: ${errorMessage}` : ''}`
        )
      }
      return response.json()
    },
  })

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const result = await mutation.mutateAsync(data)

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
        <AutoFields
          fields={props.fields}
          optionsFetchPath={`/${props.slug}/create/options`}
          disabled={mutation.isPending}
        />
        <SubmitButton pending={mutation.isPending}>Create</SubmitButton>
      </form>
    </Form>
  )
}
