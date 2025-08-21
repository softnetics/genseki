'use client'
import { FunnelIcon } from '@phosphor-icons/react'

import { BaseIcon, Button, type ButtonProps } from '../../../../components'

export interface MinimalCollectionListFilterProps {
  isLoading?: boolean
  onFilterChange?: (value: string) => void
}
export interface CollectionListFilterProps
  extends MinimalCollectionListFilterProps,
    Partial<ButtonProps> {}

export function CollectionListFilter(props: CollectionListFilterProps) {
  const createRandomText = () => {
    const random0to5 = (): number => Math.floor(Math.random() * 6)
    const arr = [
      'AAAAAAAAAAAAAAAAAAAA',
      'BBBBBBBBBBBBBBBBBB',
      'CCCCCCCCCCCCCCCCCC',
      'DDDDDDDDDDDDDDDDDD',
      'EEEEEEEEEEEEEEEEEE',
      'FFFFFFFFFFFFFFFFFF',
    ]
    return arr[random0to5()]
  }

  return (
    <Button
      aria-label="Filter"
      variant="outline"
      size="md"
      onClick={() => {
        // Random some text
        props.onFilterChange?.(createRandomText())
      }}
      leadingIcon={<BaseIcon icon={FunnelIcon} size="md" />}
      isPending={props.isLoading}
      {...props}
    >
      Filter Click to random something
    </Button>
  )
}
