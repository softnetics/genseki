import type { CollectionOptions, Fields } from '../../../core'
import type { AnyContextable } from '../../../core/context'

export interface BaseViewProps {
  slug: string
  context: AnyContextable
  collectionOptions: Omit<CollectionOptions<string, AnyContextable, Fields, any>, 'admin'>
}
