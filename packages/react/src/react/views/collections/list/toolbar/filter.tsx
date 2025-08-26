'use client'

import { FilterPanel, type FilterPanelProps } from './components/filter/filter-panel'

import { type ButtonProps } from '../../../../components'

export interface CollectionListFilterProps extends FilterPanelProps, Partial<ButtonProps> {}

/**
 * @param props.isLoading A loading state
 * @param props.onFilterChange Optional: For custom function
 */

export function CollectionListFilter(props: CollectionListFilterProps) {
  return <FilterPanel {...props} />
}
