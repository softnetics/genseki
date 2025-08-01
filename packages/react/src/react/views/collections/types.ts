import type { Fields } from '../../../core'
import type { AnyContextable } from '../../../core/context'

export interface BaseViewProps {
  slug: string
  context: AnyContextable
  identifierColumn: string
  fields: Fields
}
