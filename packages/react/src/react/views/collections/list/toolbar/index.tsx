'use client'

import { CaretLeftIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'

import { CollectionListCreate } from './create'
import { CollectionListDelete } from './delete'
import { CollectionListFilter } from './filter'
import { CollectionListSearch } from './search'

import type { CollectionToolbarActions } from '../../../../../core/collection'
import { Button, toast } from '../../../..'
import { useTableStatesContext } from '../../../../providers/table'
import { useCollectionList } from '../context'
import { useCollectionDeleteMutation } from '../hooks/use-collection-delete'

export interface CollectionListToolbarProps {
  toolbar?: Partial<CollectionToolbarActions>
}

export function CollectionListToolbar(props: CollectionListToolbarProps) {
  const context = useCollectionList()
  const queryClient = useQueryClient()
  const { rowSelectionIds, setRowSelection, isRowsSelected } = useTableStatesContext()

  const toolbar: CollectionToolbarActions = {
    create: props.toolbar?.create ?? context.toolbar?.create,
    delete: props.toolbar?.delete ?? context.toolbar?.delete,
    search: props.toolbar?.search ?? context.toolbar?.search,
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
      <Button asChild variant="ghost">
        <a href=".">
          <CaretLeftIcon />
          Back
        </a>
      </Button>
      <div className="flex gap-x-4">
        {toolbar?.delete && isRowsSelected && (
          <CollectionListDelete onDelete={() => deleteMutation.mutate(rowSelectionIds)} />
        )}
        <CollectionListSearch placeholder={toolbar?.search?.placeholder} />
        {/* TODO: Filter */}
        <CollectionListFilter />
        {toolbar?.create && <CollectionListCreate slug={context.slug} />}
      </div>
    </div>
  )
}
