import type { Fields, FieldsClient } from '../../../core'
import type { AnyContextable } from '../../../core/context'

export interface BaseViewProps {
  slug: string
  context: AnyContextable
  identifierColumn: string
  fields: Fields
}

export interface ClientBaseViewProps {
  slug: string
  identifierColumn: string
  fieldsClient: FieldsClient
}

export interface ListActions {
  create?: boolean
  update?: boolean
  delete?: boolean
  one?: boolean
}
