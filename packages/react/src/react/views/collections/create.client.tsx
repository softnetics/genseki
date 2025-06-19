'use client'

import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form'

import { Form } from '../../components'
import { AutoField } from '../../components/compound/auto-field/client'
import { SubmitButton } from '../../components/compound/submit-button'
import { useNavigation } from '../../providers'
import { useCollection, useServerFunction } from '../../providers/root'

interface CreateClientViewProps {
  slug: string
  optionsRecord: Record<string, any[]>
}

// const getDefaultValue = (fields: Fields) => {
//   const mappedCheck = Object.values(fields).reduce((prev, current) => {
//     if (current.type === 'richText') {
//       return {
//         ...prev,
//         [current.fieldName]:
//           (current.editorProviderProps.content as string) ?? current.placeholder ?? '',
//       }
//     }

//     return prev
//   }, {})

//   return mappedCheck
// }

export function CreateClientView(props: CreateClientViewProps) {
  const collection = useCollection(props.slug)
  const serverFunction = useServerFunction()
  const { navigate } = useNavigation()
  const form = useForm({
    // defaultValues: getDefaultValue(collection.fields),
  })

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
      return navigate(`./`)
    } else {
      // TODO: Handle error, e.g., show an error message
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
        {Object.values(collection.fields).map((field) => (
          <AutoField
            key={field.fieldName}
            field={field}
            visibilityField="create"
            optionsRecord={props.optionsRecord}
          />
        ))}
        <SubmitButton>Create</SubmitButton>
      </form>
      {JSON.stringify(w, null, 2)}
    </Form>
  )
}
