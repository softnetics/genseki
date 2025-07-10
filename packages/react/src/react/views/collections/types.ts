import type { AnyFields } from '../../../core'
import type { CollectionOptions } from '../../../core/collection'
import type { AnyContextable } from '../../../core/context'

export interface BaseViewProps {
  slug: string
  context: AnyContextable
  collectionOptions: CollectionOptions<string, AnyContextable, AnyFields, {}>
}
