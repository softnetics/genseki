'use client'

import { type DefaultValues, type FieldValues, useForm, type UseFormProps } from 'react-hook-form'

import { getDefaultValueFromFieldsClient } from '../../../../core'
import { useStorageAdapter } from '../../../providers/root'
import { useCollection } from '../context'

export const useCollectionForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues,
>(
  props?: UseFormProps<TFieldValues, TContext, TTransformedValues>
) => {
  const storageAdapter = useStorageAdapter()
  const { fields } = useCollection()

  return useForm<TFieldValues, TContext, TTransformedValues>({
    defaultValues:
      props?.defaultValues ??
      (getDefaultValueFromFieldsClient(fields, storageAdapter) as DefaultValues<TFieldValues>),
    ...props,
  })
}
