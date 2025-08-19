'use client'
import { TrashIcon } from '@phosphor-icons/react'
import type { Promisable } from 'type-fest'

import { BaseIcon, Button, type ButtonProps } from '../../../../components'

export interface MinimalCollectionListDeleteProps {
  isLoading?: boolean
  onDelete?: () => Promisable<void>
}

export interface CollectionListDeleteProps
  extends MinimalCollectionListDeleteProps,
    Partial<ButtonProps> {}

export const CollectionListDelete = (props: CollectionListDeleteProps) => {
  return (
    <Button
      aria-label="Delete"
      leadingIcon={<BaseIcon icon={TrashIcon} size="md" />}
      onClick={props.onDelete}
      isPending={props.isLoading}
      variant="destruction"
      size="md"
      {...props}
    >
      Delete
    </Button>
  )
}
