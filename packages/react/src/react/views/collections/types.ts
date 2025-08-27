import type { Fields, FieldsClient } from '../../../core'
import type { AnyContextable } from '../../../core/context'

export interface BaseViewProps {
  slug: string
  context: AnyContextable
  fields: Fields
}

export interface ClientBaseViewProps {
  slug: string
  fieldsClient: FieldsClient
}

export interface BaseData {
  __pk: string | number
  __id: string | number
}
