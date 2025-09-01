import { type DefaultValues, type FieldValues, useForm, type UseFormProps } from 'react-hook-form'

import { getDefaultValueFromFieldsClient } from '../../../../../core'
import { useStorageAdapter } from '../../../../providers/root'
import { useCollection } from '../../context'

export const useCreateFormWithDefaultValues = <TFieldValues extends FieldValues>(
  props?: Omit<UseFormProps<TFieldValues>, 'defaultValues'>
) => {
  const storageAdapter = useStorageAdapter()
  const { fields } = useCollection()

  return useForm<TFieldValues>({
    defaultValues: getDefaultValueFromFieldsClient(
      fields,
      storageAdapter
    ) as DefaultValues<TFieldValues>,
    ...props,
  })
}
