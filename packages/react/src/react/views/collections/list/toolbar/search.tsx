'use client'
import React from 'react'

import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useControllableState } from '@radix-ui/react-use-controllable-state'

import { BaseIcon, TextField } from '../../../../components'
import { useDebounce } from '../../../../hooks/use-debounce'
import { useSearch } from '../../../../hooks/use-search'

export interface CollectionListSearchProps {
  placeholder?: string
  search?: string // Optional — Controlled input
  onSearchChange?: (value: string) => void // Optional — Controlled input
  isLoading?: boolean
}

/**
 * @param props.search A controlled input for search value
 * @param props.onSearchChange An event handler for search value change
 * @param props.isLoading A loading state
 */
export function CollectionListSearch(props: CollectionListSearchProps) {
  const { search: paramSearch, setSearch: setParamSearch } = useSearch()
  const [search, onSearch] = useControllableState({
    prop: props.search,
    onChange: props.onSearchChange,
    defaultProp: paramSearch,
  })

  useDebounce(
    search,
    (value: string) => {
      setParamSearch(value)
    },
    500
  )

  return (
    <TextField
      aria-label="Search"
      placeholder={props.placeholder ?? 'Search'}
      prefix={<BaseIcon icon={MagnifyingGlassIcon} size="md" />}
      isPending={props.isLoading}
      value={search}
      onChange={onSearch}
    />
  )
}
