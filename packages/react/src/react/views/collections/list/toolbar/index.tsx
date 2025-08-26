'use client'

import { useState } from 'react'

import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { useQueryClient } from '@tanstack/react-query'

import { optionsFetchPathName } from './components/filter/filter-helper'
import { FilterToggle } from './components/filter/filter-toggle'
import { CollectionListCreate } from './create'
import { CollectionListDelete } from './delete'
import { CollectionListFilter } from './filter'
import { CollectionListSearch } from './search'

// import { CollectionListCreate, type MinimalCollectionListCreateProps } from './create'
// import { CollectionListDelete, type MinimalCollectionListDeleteProps } from './delete'
// import { CollectionListFilter } from './filter'
// import { CollectionListSearch, type CollectionListSearchProps } from './search'
import type { CollectionListActions } from '../../../../../core/collection'
import { toast } from '../../../..'
import { BaseIcon, ButtonLink } from '../../../../components'
import { useTableStatesContext } from '../../../../providers/table'
import { cn } from '../../../../utils/cn'
import { useCollectionList } from '../context'
import { useCollectionDeleteMutation } from '../hooks/use-collection-delete'

export interface CollectionListToolbarProps {
  actions?: Partial<CollectionListActions>
}
// import { cn } from '../../../../utils/cn'
// import type { ListActions } from '../../types'

// export interface CollectionListToolbarProps
//   extends CollectionListSearchProps,
//     MinimalCollectionListDeleteProps,
//     MinimalCollectionListFilterProps,
//     MinimalCollectionListCreateProps {
//   isShowDeleteButton?: boolean
//   actions?: ListActions
//   filterOptions: FilterFieldOptions[]
//   allowedFilters: string[]
//   onFilterChange?: (value: string) => void
// }

export function CollectionListToolbar(props: CollectionListToolbarProps) {
  const context = useCollectionList()
  const queryClient = useQueryClient()
  const { rowSelectionIds, setRowSelection, isRowsSelected } = useTableStatesContext()

  const actions: CollectionListActions = {
    create: props.actions?.create ?? context.actions?.create,
    update: props.actions?.update ?? context.actions?.update,
    delete: props.actions?.delete ?? context.actions?.delete,
    one: props.actions?.one ?? context.actions?.one,
  }
  const deleteMutation = useCollectionDeleteMutation({
    slug: context.slug,
    onSuccess: async () => {
      setRowSelection({})
      await queryClient.invalidateQueries({
        queryKey: ['GET', `/${context.slug}`],
      })
      toast.success('Deletion successfully')
    },
    onError: () => {
      toast.error('Failed to delete items')
    },
  })

  const [filterPanelOpen, setFilterPanelOpen] = useState(false)

  return (
    <div>
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
          {actions?.delete && isRowsSelected && (
            <CollectionListDelete onDelete={() => deleteMutation.mutate(rowSelectionIds)} />
          )}
          <CollectionListSearch />
          {/* TODO: Filter */}
          <FilterToggle
            isOpen={filterPanelOpen}
            onClick={() => {
              setFilterPanelOpen((p) => !p)
            }}
          />
          {actions?.create && <CollectionListCreate slug={context.slug} />}
        </div>
      </div>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          filterPanelOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <CollectionListFilter
            slug={context.slug}
            filterOptions={Object.values(context.fields.shape).map((fieldShape) => {
              return {
                fieldShape,
                optionsName: optionsFetchPathName(fieldShape),
              }
            })}
            allowedFilters={context.filter || []}
          />
        </div>
      </div>
    </div>
  )
}
