'use client'
import { AutoField, type AutoFieldProps } from '../../../components'
import { useCollection } from '../context'

export interface FieldProps extends Omit<AutoFieldProps, 'fieldShape' | 'optionsFetchPath'> {
  fieldName: string
}

const Field = ({ fieldName, ...rest }: FieldProps) => {
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
