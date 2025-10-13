'use client'
import { TrashIcon } from '@phosphor-icons/react'
import type { Promisable } from 'type-fest'

import { AriaButton, type AriaButtonProps, BaseIcon } from '../../../../components'

export interface MinimalCollectionListDeleteProps {
  isLoading?: boolean
  onDelete?: () => Promisable<void>
}

export interface CollectionListDeleteProps
  extends MinimalCollectionListDeleteProps,
    Partial<AriaButtonProps> {}

export function CollectionListDelete(props: CollectionListDeleteProps) {
  return (
    <AriaButton
      aria-label="Delete"
      leadingIcon={<BaseIcon icon={TrashIcon} size="md" />}
      onClick={props.onDelete}
      isPending={props.isLoading}
      variant="destruction"
      size="md"
      {...props}
    >
      Delete
    </AriaButton>
  )
}
