'use client'

import { useMemo } from 'react'
import { type DefaultValues, type FieldValues, useForm, type UseFormProps } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { getDefaultValueFromFieldsClient } from '../../../../core'
import { fieldsShapeToZodObject } from '../../../../core/field'
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
  const schema = useMemo(() => {
    return fieldsShapeToZodObject(fields.shape)
  }, [])
  return useForm<TFieldValues, TContext, TTransformedValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues:
      props?.defaultValues ??
      (getDefaultValueFromFieldsClient(fields, storageAdapter) as DefaultValues<TFieldValues>),
    ...props,
  })
}
