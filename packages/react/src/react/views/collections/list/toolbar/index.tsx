'use client'

import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { useQueryClient } from '@tanstack/react-query'

import { CollectionListCreate } from './create'
import { CollectionListDelete } from './delete'
import { CollectionListFilter } from './filter'
import { CollectionListSearch } from './search'

import type { CollectionListActions } from '../../../../../core/collection'
import { toast } from '../../../..'
import { BaseIcon, ButtonLink } from '../../../../components'
import { useTableStatesContext } from '../../../../providers/table'
import { useCollectionList } from '../context'
import { useCollectionDeleteMutation } from '../hooks/use-collection-delete'

export interface CollectionListToolbarProps {
  actions?: Partial<CollectionListActions>
}

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
        {actions?.delete && isRowsSelected && (
          <CollectionListDelete onDelete={() => deleteMutation.mutate(rowSelectionIds)} />
        )}
        <CollectionListSearch />
        {/* TODO: Filter */}
        <CollectionListFilter />
        {actions?.create && <CollectionListCreate slug={context.slug} />}
        {/* <CollectionListFilter isLoading={props.isLoading} onFilterChange={props.onFilterChange} />{' '} */}
      </div>
    </div>
  )
}
