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
