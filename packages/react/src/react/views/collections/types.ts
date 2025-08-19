import type { Fields } from '../../../core'
import type { AnyContextable } from '../../../core/context'

export interface BaseViewProps<TFields extends Fields = Fields> {
  slug: string
  context: AnyContextable
  identifierColumn: string
  fields: TFields
}

export interface ListFeatures {
  create?: boolean
  update?: boolean
  delete?: boolean
  one?: boolean
}
