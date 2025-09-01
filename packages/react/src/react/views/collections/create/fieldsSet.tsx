'use client'
import { AutoFields, type AutoFieldsProps } from '../../../components'
import { useCollection } from '../context'

export interface FieldsSetProps extends Omit<AutoFieldsProps, 'fields' | 'optionsFetchPath'> {}

const FieldsSet = (props: FieldsSetProps) => {
  const { fields, slug } = useCollection()

  return <AutoFields fields={fields} optionsFetchPath={`/${slug}/create/options`} {...props} />
}

export default FieldsSet
