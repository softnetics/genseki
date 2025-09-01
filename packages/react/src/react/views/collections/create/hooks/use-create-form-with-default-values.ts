import { type DefaultValues, type FieldValues, useForm, type UseFormProps } from 'react-hook-form'

import { getDefaultValueFromFieldsClient } from '../../../../../core'
import { useStorageAdapter } from '../../../../providers/root'
import { useCollection } from '../../context'

export const useCreateForm = <TFieldValues extends FieldValues>(
  props?: UseFormProps<TFieldValues>
) => {
  const storageAdapter = useStorageAdapter()
  const { fields } = useCollection()

  return useForm<TFieldValues>({
    defaultValues:
      props?.defaultValues ??
      (getDefaultValueFromFieldsClient(fields, storageAdapter) as DefaultValues<TFieldValues>),
    ...props,
  })
}
