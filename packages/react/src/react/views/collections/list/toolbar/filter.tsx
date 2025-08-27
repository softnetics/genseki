'use client'

import { isThisFieldShapeFilterable, isThisFilterAllowed } from './components/filter/filter-helper'
import {
  CollectionListFilterPanel,
  type FilterFieldOptions,
} from './components/filter/panel-content'

import { type ButtonProps } from '../../../../components'
import { useFilter } from '../../../../hooks/use-filter'

export interface MinimalCollectionListFilterProps {
  isLoading?: boolean
  onFilterChange?: (value: string) => void
}

export interface CollectionListFilterProps
  extends MinimalCollectionListFilterProps,
    Partial<ButtonProps> {
  slug: string
  filterOptions: FilterFieldOptions[]
  allowedFilters: string[]
}

/**
 * @param props.isLoading A loading state
 * @param props.onFilterChange Optional: For custom function
 */

export function CollectionListFilter(props: CollectionListFilterProps) {
  const { setFilter } = useFilter({ debounce: 500 })

  const filterable = props.filterOptions.filter((e) => isThisFieldShapeFilterable(e.fieldShape))

  const whatFilterCanIFetch = [] // use this to fetch for optionsName
  const whatFilterCanIFormulate = [] // these you will have to create a component to handle the filter value(s) yourself

  for (const e of filterable) {
    if (e.optionsName) {
      whatFilterCanIFetch.push(e)
    } else if (isThisFilterAllowed(e.fieldShape.$client.fieldName, props.allowedFilters)) {
      whatFilterCanIFormulate.push(e)
    }
  }

  return (
    <CollectionListFilterPanel
      slug={props.slug}
      fetchList={whatFilterCanIFetch}
      formulateList={whatFilterCanIFormulate}
      onApplyFilter={(newFilter) => {
        props.onFilterChange ? props.onFilterChange(newFilter) : setFilter(newFilter)
      }}
      onClearFilter={() => {
        props.onFilterChange ? props.onFilterChange('') : setFilter('')
      }}
    />
  )
}
