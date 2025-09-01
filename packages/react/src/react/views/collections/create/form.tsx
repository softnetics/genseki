import {
  type FieldValues,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormProps,
} from 'react-hook-form'

import { useCreateForm } from './hooks/use-create-form-with-default-values'

import { Form } from '../../../components'

export interface CreateFormProps<TFieldValues extends FieldValues> {
  onSubmit: SubmitHandler<TFieldValues>
  children: React.ReactNode
  onError?: SubmitErrorHandler<TFieldValues>
  formOptions?: Omit<UseFormProps<TFieldValues>, 'defaultValues'>
}

export const CreateForm = <TFieldValues extends FieldValues>({
  children,
  onSubmit,
  onError,
  formOptions,
}: CreateFormProps<TFieldValues>) => {
  const form = useCreateForm(formOptions)

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-y-8 mt-16"
      >
        {children}
      </form>
    </Form>
  )
}
