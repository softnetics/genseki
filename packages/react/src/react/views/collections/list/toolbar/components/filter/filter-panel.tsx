'use client'

import { isThisFilterAllowed, isThisTypeFilterable } from './filter-helper'
import { CollectionListFilterPanel, type FilterFieldOptions } from './panel-content'

import { useFilter } from '../../../../../../hooks/use-filter'

export interface MinimalCollectionListFilterProps {
  isLoading?: boolean
  onFilterChange?: (value: string) => void
}

export interface FilterPanelProps extends MinimalCollectionListFilterProps {
  slug: string
  filterOptions: FilterFieldOptions[]
  allowedFilters: string[]
}

export function FilterPanel(props: FilterPanelProps) {
  const { setFilter } = useFilter({ debounce: 500 })

  const filterable = props.filterOptions.filter((e) => isThisTypeFilterable(e.fieldShape))

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
