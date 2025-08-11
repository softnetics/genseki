'use client'

import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { FieldsClient } from '../../../core'
import { Form } from '../../components'
import { AutoFields } from '../../components/compound/auto-field'
import { SubmitButton } from '../../components/compound/submit-button'
import { useNavigation } from '../../providers'

interface UpdateClientViewProps {
  slug: string
  identifier: string
  fields: FieldsClient
  defaultValues?: Record<string, any>
}

export function UpdateClientView(props: UpdateClientViewProps) {
  const form = useForm({
    defaultValues: props.defaultValues,
  })

  const { navigate } = useNavigation()

  const mutation = useMutation<{
    status: number
    body: { __pk: string; __id: string }
  }>({
    mutationKey: ['PATCH', `/api/${props.slug}`],
    mutationFn: async (data: any) => {
      // TODO: This should be provided from App Config
      const response = await fetch(`/api/${props.slug}/${props.identifier}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        let errorBody;
        try {
          errorBody = await response.text();
        } catch (e) {
          errorBody = '<unable to read response body>';
        }
        throw new Error(
          `Failed to update (status: ${response.status}): ${errorBody}`
        );
      }
      return response.json()
    },
  })

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const result = await mutation.mutateAsync(data)

    if (result.status === 200) {
      toast.success('Updation successfully')
      return navigate(`../`)
    } else {
      const description =
        typeof result.body === 'object' &&
        !!result.body &&
        'message' in result.body &&
        typeof result.body.message === 'string'
          ? result.body.message
          : 'Failed to update'
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
        <AutoFields
          fields={props.fields}
          optionsFetchPath={`/${props.slug}/update/options`}
          disabled={mutation.isPending}
        />
        <SubmitButton pending={mutation.isPending}>Update</SubmitButton>
      </form>
    </Form>
  )
}
