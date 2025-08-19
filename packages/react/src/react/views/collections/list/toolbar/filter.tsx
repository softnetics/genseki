'use client'
import { FunnelIcon } from '@phosphor-icons/react'

import { BaseIcon, Button, type ButtonProps } from '../../../../components'

export interface MinimalCollectionListFilterProps {
  isLoading?: boolean
}
export interface CollectionListFilterProps
  extends MinimalCollectionListFilterProps,
    Partial<ButtonProps> {}

export const CollectionListFilter = (props: CollectionListFilterProps) => {
  return (
    <Button
      aria-label="Filter"
      variant="outline"
      size="md"
      leadingIcon={<BaseIcon icon={FunnelIcon} size="md" />}
      isPending={props.isLoading}
      {...props}
    >
      Filter
    </Button>
  )
}
