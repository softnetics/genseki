'use client'

import { Form, type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form'

import { AutoField } from '../../components/compound/auto-field/client'
import { SubmitButton } from '../../components/compound/submit-button'
import { useCollection, useServerFunction } from '../../providers/root'

interface UpdateClientViewProps {
  identifer: string
  slug: string
  optionsRecord: Record<string, any[]>
  defaultValues?: Record<string, any>
}

export function UpdateClientView(props: UpdateClientViewProps) {
  const form = useForm({
    defaultValues: props.defaultValues,
  })
  const collection = useCollection(props.slug)
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
      // TODO: Pass redirect from context
      // redirect(`../`) // Redirect to the list page
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
        {Object.values(collection.fields).map((field) => (
          <AutoField
            key={field.fieldName}
            field={field}
            visibilityField="update"
            optionsRecord={props.optionsRecord}
          />
        ))}
        <SubmitButton>Update</SubmitButton>
      </form>
      {JSON.stringify(w, null, 2)}
    </Form>
  )
}
