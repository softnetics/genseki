'use client'

import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'

import { CollectionListCreate, type MinimalCollectionListCreateProps } from './create'
import { CollectionListDelete, type MinimalCollectionListDeleteProps } from './delete'
import { CollectionListFilter, type MinimalCollectionListFilterProps } from './filter'
import { CollectionListSearch, type CollectionListSearchProps } from './search'

import { BaseIcon, ButtonLink } from '../../../../components'
import type { ListActions } from '../../types'

export interface CollectionListToolbarProps
  extends CollectionListSearchProps,
    MinimalCollectionListDeleteProps,
    MinimalCollectionListFilterProps,
    MinimalCollectionListCreateProps {
  isShowDeleteButton?: boolean
  actions?: ListActions
}

/**
 * @param props.slug A slug for page
 * @param props.isLoading A loading state for the toolbar
 * @param props.isShowDeleteButton A boolean to show/hide delete button
 * @param props.onDelete A callback function when delete button is clicked
 * @param props.features Features configuration for the list view
 */
export function CollectionListToolbar(props: CollectionListToolbarProps) {
  const { isShowDeleteButton = false, actions } = props

  return (
    <div className="flex items-center justify-between gap-x-3">
      <ButtonLink
        aria-label="Back"
        href="."
        variant="ghost"
        size="md"
        leadingIcon={<BaseIcon icon={CaretLeftIcon} size="md" />}
      >
        Back
      </ButtonLink>
      <div className="flex items-center gap-x-4">
        {actions?.delete && isShowDeleteButton && (
          <CollectionListDelete onDelete={props.onDelete} isLoading={props.isLoading} />
        )}
        <CollectionListSearch
          isLoading={props.isLoading}
          onSearchChange={props.onSearchChange}
          search={props.search}
        />
        <CollectionListFilter isLoading={props.isLoading} /> {/* TODO: Filter */}
        {actions?.create && <CollectionListCreate isLoading={props.isLoading} slug={props.slug} />}
      </div>
    </div>
  )
}
