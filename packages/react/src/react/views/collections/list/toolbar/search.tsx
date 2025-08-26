'use client'
import React, { useMemo } from 'react'

import { MagnifyingGlassIcon } from '@phosphor-icons/react'

import { BaseIcon, TextField } from '../../../../components'
import { useSearch } from '../../../../hooks/use-search'

export interface CollectionListSearchProps {
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
  const { search, setSearch } = useSearch({
    debounce: 500,
  })

  const isIncorrectControlledInput = useMemo(
    () =>
      [typeof props.onSearchChange === 'undefined', typeof props.search === 'undefined'].filter(
        (option) => !!option
      ).length === 1,
    []
  )

  if (isIncorrectControlledInput) {
    throw new Error(
      'The controlled input is not properly configured. You need to provide either `onSearchChange` and `search` for controlled input'
    )
  }

  return (
    <TextField
      aria-label="Search"
      placeholder="Search"
      prefix={<BaseIcon icon={MagnifyingGlassIcon} size="md" />}
      className="w-full"
      isPending={props.isLoading}
      value={props.search ?? search}
      onChange={props.onSearchChange ?? setSearch}
    />
  )
}
