'use client'
import { AutoFields, type AutoFieldsProps } from '../../../components'
import { useCollection } from '../context'

export interface FieldsProps extends Omit<AutoFieldsProps, 'fields' | 'optionsFetchPath'> {}

export function Fields(props: FieldsProps) {
  const { fields, slug } = useCollection()

  return <AutoFields fields={fields} optionsFetchPath={`/${slug}/create/options`} {...props} />
}
