'use client'

import { type DefaultValues, type FieldValues, useForm, type UseFormProps } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import type z from 'zod'

import { getDefaultValueFromFieldsClient } from '../../../../core'
import {
  type FieldsShape,
  type FieldsShapeToZodObject,
  fieldsShapeToZodObject,
} from '../../../../core/field'
import { useStorageAdapter } from '../../../providers/root'
import { useCollection } from '../context'

export const useCollectionForm = <
  TFieldsShape extends FieldsShape = FieldsShape,
  TContext = any,
  TTransformedValues extends FieldValues = FieldValues,
>(
  props?: UseFormProps<z.infer<FieldsShapeToZodObject<TFieldsShape>>, TContext, TTransformedValues>
) => {
  const storageAdapter = useStorageAdapter()
  const { fields } = useCollection()

  const schema = fieldsShapeToZodObject(fields.shape as TFieldsShape)

  return useForm<z.infer<FieldsShapeToZodObject<TFieldsShape>>, TContext, TTransformedValues>({
    defaultValues:
      props?.defaultValues ??
      (getDefaultValueFromFieldsClient(fields, storageAdapter) as DefaultValues<
        z.infer<FieldsShapeToZodObject<TFieldsShape>>
      >),
    resolver: standardSchemaResolver(schema),
    ...props,
  })
}
