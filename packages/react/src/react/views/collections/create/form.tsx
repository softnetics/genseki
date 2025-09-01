import { type SubmitHandler, type UseFormProps } from 'react-hook-form'

import useCreateFormWithDefaultValues from './hooks/use-create-form-with-default-values'

import { Form } from '../../../components'

export interface CreateFormProps {
  onSubmit: SubmitHandler<any>
  children: React.ReactNode
  formOptions?: Omit<UseFormProps, 'defaultValues'>
}

const CreateForm = ({ children, onSubmit, formOptions }: CreateFormProps) => {
  const form = useCreateFormWithDefaultValues(formOptions)

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-8 mt-16"
      >
        {children}
      </form>
    </Form>
  )
}

export default CreateForm
