'use client'

import { useMemo } from 'react'

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

  const { whatFilterCanIFetch, whatFilterCanIFormulate } = useMemo(() => {
    const fetchList: typeof filterable = [] // this is those "select" options, will have to fetch for choices
    const formulateList: typeof filterable = [] // this is other types, create a filter component to handle each type separately

    for (const e of filterable) {
      if (e.optionsName) {
        fetchList.push(e)
      } else if (isThisFilterAllowed(e.fieldShape.$client.fieldName, props.allowedFilters)) {
        formulateList.push(e)
      }
    }

    return { whatFilterCanIFetch: fetchList, whatFilterCanIFormulate: formulateList }
  }, [filterable, props.allowedFilters])

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
