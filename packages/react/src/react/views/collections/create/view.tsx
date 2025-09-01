import { type SubmitHandler } from 'react-hook-form'

import { toast } from 'sonner'

import { useCollectionCreate } from './context'
import { useCollectionCreateMutation } from './hooks/use-collection-create-mutation'

import { SubmitButton } from '../../../components'
import { useNavigation } from '../../../providers'

export function CreateView() {
  const { navigate } = useNavigation()
  const {
    components: { CreateForm, CreateFields: FieldsSet },
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

  const onSubmit: SubmitHandler<any> = (data: any) => mutation.mutateAsync(data)

  return (
    <CreateForm onSubmit={onSubmit}>
      <FieldsSet disabled={mutation.isPending} />
      <SubmitButton pending={mutation.isPending}>Create</SubmitButton>
    </CreateForm>
  )
}
