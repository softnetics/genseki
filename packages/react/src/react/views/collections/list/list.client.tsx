'use client'

import React, { useMemo } from 'react'

import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { toast } from 'sonner'

import { useCollectionDeleteMutation, useCollectionListQuery } from './hooks'
import { useCollectionListTable } from './table'
import { CollectionListPagination } from './table/pagination'
import { CollectionListToolbar } from './toolbar'

import type { BaseData } from '../../../../core'
import { useCollectionListContext } from '../../../../core/collection/list/context'
import {
  BaseIcon,
  Checkbox,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  TanstackTable,
} from '../../../components'
import { useNavigation, useTableStatesContext } from '../../../providers'
import { cn } from '../../../utils/cn'

export interface CollectionListTableContainerProps {
  children?: React.ReactNode
  className?: string
}

export function CollectionListTableContainer(props: CollectionListTableContainerProps) {
  return (
    <div
      className={cn('p-12 max-w-[1200px] mx-auto flex w-full flex-col gap-y-12', props.className)}
    >
      {props.children}
    </div>
  )
}

export function DefaultCollectionListPage() {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const context = useCollectionListContext()
  const { pagination, isRowsSelected, rowSelectionIds, setRowSelection } = useTableStatesContext()

  const query = useCollectionListQuery({ slug: context.slug })

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

  const columns = useMemo(() => {
    if (query.isLoading) return context.columns

    const columnHelper = createColumnHelper<BaseData>()
    return [
      ...(context.actions?.delete
        ? [
            columnHelper.display({
              id: 'select',
              header: ({ table }) => (
                <Checkbox
                  isSelected={table.getIsAllRowsSelected()}
                  isIndeterminate={table.getIsSomeRowsSelected()}
                  onChange={(checked) =>
                    table.getToggleAllRowsSelectedHandler()({ target: { checked } })
                  }
                />
              ),
              cell: ({ row }) => (
                <Checkbox
                  isSelected={row.getIsSelected()}
                  isDisabled={!row.getCanSelect()}
                  onChange={(checked) => row.getToggleSelectedHandler()({ target: { checked } })}
                />
              ),
            }),
          ]
        : []),
      ...context.columns,
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => {
          if (!context.actions?.one && !context.actions?.update && !context.actions?.delete) {
            return null
          }

          return (
            <div className="grid place-items-center">
              <Menu>
                <MenuTrigger aria-label="Actions Icon" className="cursor-pointer">
                  <BaseIcon icon={DotsThreeVerticalIcon} size="md" weight="bold" />
                </MenuTrigger>
                <MenuContent aria-label="Actions" placement="left top">
                  {context.actions.one && (
                    <MenuItem
                      aria-label="View"
                      onAction={() => {
                        navigation.navigate(`./${context.slug}/${row.original.__id}`)
                      }}
                    >
                      View
                    </MenuItem>
                  )}
                  {context.actions.update && (
                    <MenuItem
                      aria-label="Edit"
                      onAction={() => {
                        navigation.navigate(`./${context.slug}/update/${row.original.__id}`)
                      }}
                    >
                      Edit
                    </MenuItem>
                  )}
                  {context.actions?.delete && (
                    <>
                      {context.actions.one || (context.actions.update && <MenuSeparator />)}
                      <MenuItem
                        aria-label="Delete"
                        isDanger
                        onAction={() => {
                          deleteMutation.mutate([row.original.__id.toString()])
                        }}
                      >
                        Delete
                      </MenuItem>
                    </>
                  )}
                </MenuContent>
              </Menu>
            </div>
          )
        },
      }),
    ] as ColumnDef<{ __pk: string; __id: string }>[]
  }, [context.columns, context.actions, query.isLoading])

  const table = useCollectionListTable({
    total: query.data?.total,
    data: query.data?.data || [],
    columns: columns,
    search: context.search,
    sortBy: context.sortBy,
  })

  const isError = deleteMutation.isError || query.isError
  const isLoading = deleteMutation.isPending || query.isPending || query.isFetching

  return (
    <>
      <CollectionListToolbar />
      <TanstackTable
        table={table}
        loadingItems={pagination.pageSize}
        className="static"
        onRowClick="toggleSelect"
        isLoading={isLoading}
        isError={isError}
        configuration={{
          search: context.search,
          sortBy: context.sortBy,
        }}
      />
      <CollectionListPagination />
    </>
  )
}
