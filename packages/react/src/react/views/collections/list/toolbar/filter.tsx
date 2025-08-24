'use client'
import { FunnelIcon } from '@phosphor-icons/react'

import { BaseIcon, Button, type ButtonProps } from '../../../../components'
import { useFilter } from '../../../../hooks/use-filter'

export interface MinimalCollectionListFilterProps {
  isLoading?: boolean
  onFilterChange?: (value: string) => void // Optional function to handle filter changes
}
export interface CollectionListFilterProps
  extends MinimalCollectionListFilterProps,
    Partial<ButtonProps> {}

/**
 * @param props.onFilterChange An event handler for search value change
 * @param props.isLoading A loading state
 */
export function CollectionListFilter(props: CollectionListFilterProps) {
  const { setFilter } = useFilter({ debounce: 500 })

  const createRandomText = () => {
    const random0to5 = (): number => Math.floor(Math.random() * 6)
    const arr = [
      '{"title":"o","isActive":"true"}',
      '{"title":"o","isActive":"true"}',
      '{"title":"o","isActive":"true"}',
      '{"author":{"email":{"contains":"gmail"}}}',
      '{"author":{"email":{"contains":"gmail"}}}',
      '{"author":{"email":{"contains":"gmail"}}}',
      // '{"author":{"email":{"contains":"gmail"}},"title":"rr"}',
      // '{"author":{"email":{"contains":"gmail"}},"title":"rr"}',
      // '{"author":{"email":{"contains":"gmail"}},"title":"rr"}',
    ]
    return arr[random0to5()]
  }

  return (
    <Button
      aria-label="Filter"
      variant="outline"
      size="md"
      onClick={() => {
        // Open a modal or something to select filter options
        // Implement logic over there, not here
        props.onFilterChange
          ? props.onFilterChange(createRandomText())
          : setFilter(createRandomText())
      }}
      leadingIcon={<BaseIcon icon={FunnelIcon} size="md" />}
      isPending={props.isLoading}
      {...props}
    >
      Filter Click to random something
    </Button>
  )
}
