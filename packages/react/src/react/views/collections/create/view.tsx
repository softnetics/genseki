import { type SubmitHandler } from 'react-hook-form'

import { toast } from 'sonner'

import { useCollectionCreate } from './context'
import { useCollectionForm } from './hooks'
import { useCollectionCreateMutation } from './hooks/use-collection-create-mutation'

import { Form, SubmitButton } from '../../../components'
import { useNavigation } from '../../../providers'

export function CreateView() {
  const { navigate } = useNavigation()
  const {
    components: { CreateFields },
  } = useCollectionCreate()

  const mutation = useCollectionCreateMutation({
    onSuccess: () => {
      toast.success('Creation successfully')
      return navigate(`./`)
    },
    onError: ({ status, message }) => {
      toast.error(`Failed to create (${status}): ${message}`)
    },
  })

  const form = useCollectionForm()

  const onSubmit: SubmitHandler<any> = (data: any) => mutation.mutateAsync(data)

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-8 mt-16"
      >
        <CreateFields disabled={mutation.isPending} />
        <SubmitButton pending={mutation.isPending}>Create</SubmitButton>
      </form>
    </Form>
  )
}
