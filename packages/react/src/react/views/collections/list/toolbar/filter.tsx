'use client'

import { FunnelIcon } from '@phosphor-icons/react'

import { Button } from '@genseki/react/v2'

import type { InputGroupButton } from '../../../../components'

export interface MinimalCollectionListFilterProps {
  isLoading?: boolean
}
export interface CollectionListFilterProps
  extends MinimalCollectionListFilterProps,
    Partial<typeof InputGroupButton> {}

export function CollectionListFilter(props: CollectionListFilterProps) {
  return (
    <Button variant="outline" {...props}>
      <FunnelIcon /> Filter
    </Button>
  )
}
