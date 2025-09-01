'use client'
import { AutoField, type AutoFieldProps } from '../../../components'
import { useCollection } from '../context'

export interface FieldProps<TFieldValues extends {} = {}>
  extends Omit<AutoFieldProps, 'fieldShape' | 'optionsFetchPath'> {
  fieldName: keyof TFieldValues
}

const Field = <TFieldValues extends {}>({ fieldName, ...rest }: FieldProps<TFieldValues>) => {
  const { fields, slug } = useCollection()

  return (
    <AutoField
      fieldShape={fields.shape[fieldName]}
      optionsFetchPath={`/${slug}/create/options`}
      {...rest}
    />
  )
}

export default Field
