'use client'

import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form'

import { Form } from '../../components'
import { AutoField } from '../../components/compound/auto-field/client'
import { SubmitButton } from '../../components/compound/submit-button'
import { useNavigation } from '../../providers'
import { useCollection, useServerFunction } from '../../providers/root'

interface UpdateClientViewProps {
  slug: string
  identifer: string
  optionsRecord: Record<string, any[]>
  defaultValues?: Record<string, any>
}

export function UpdateClientView(props: UpdateClientViewProps) {
  const form = useForm({ defaultValues: props.defaultValues })
  const collection = useCollection(props.slug)
  const serverFunction = useServerFunction()
  const { navigate } = useNavigation()

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
      return navigate(`../`) // Redirect to the list page
    } else {
      // TODO: Handle error, e.g., show an error message
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
