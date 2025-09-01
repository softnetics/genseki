import { useForm, type UseFormProps } from 'react-hook-form'

import { getDefaultValueFromFieldsClient } from '../../../../../core'
import { useStorageAdapter } from '../../../../providers/root'
import { useCollection } from '../../context'

const useCreateFormWithDefaultValues = (props?: Omit<UseFormProps, 'defaultValues'>) => {
  const storageAdapter = useStorageAdapter()
  const { fields } = useCollection()

  return useForm({
    defaultValues: getDefaultValueFromFieldsClient(fields, storageAdapter),
    ...props,
  })
}

export default useCreateFormWithDefaultValues
