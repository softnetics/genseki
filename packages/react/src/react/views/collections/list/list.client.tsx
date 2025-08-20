'use client'

import React, { useMemo } from 'react'

import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { toast } from 'sonner'

import { useCollectionDeleteMutation, useCollectionListQuery } from './hooks'
import { useClientListViewPropsContext } from './providers'
import { useCollectionListTable } from './table'
import { CollectionListPagination } from './table/pagination'
import { CollectionListToolbar } from './toolbar'

import type { BaseData } from '../../../../core'
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

export interface ListViewWrapperProps {
  children?: React.ReactNode
  className?: string
}

export const ListViewWrapper = (props: ListViewWrapperProps) => {
  return (
    <div
      className={cn('p-12 max-w-[1200px] mx-auto flex w-full flex-col gap-y-12', props.className)}
    >
      {props.children}
    </div>
  )
}

export function ListViewClient() {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const listViewProps = useClientListViewPropsContext()
  const { pagination, isRowsSelected, rowSelectionIds, setRowSelection } = useTableStatesContext()

  const query = useCollectionListQuery({ slug: listViewProps.slug })

  const deleteMutation = useCollectionDeleteMutation({
    slug: listViewProps.slug,
    onSuccess: async () => {
      setRowSelection({})
      await queryClient.invalidateQueries({
        queryKey: ['GET', `/${listViewProps.slug}`],
      })
      toast.success('Deletion successfully')
    },
    onError: () => {
      toast.error('Failed to delete items')
    },
  })

  const columns = useMemo(() => {
    if (query.isLoading) return listViewProps.columns

    const columnHelper = createColumnHelper<BaseData>()
    return [
      ...(listViewProps.actions?.delete
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
      ...listViewProps.columns,
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => {
          if (
            !listViewProps.actions?.one &&
            !listViewProps.actions?.update &&
            !listViewProps.actions?.delete
          ) {
            return null
          }

          return (
            <div className="grid place-items-center">
              <Menu>
                <MenuTrigger aria-label="Actions Icon" className="cursor-pointer">
                  <BaseIcon icon={DotsThreeVerticalIcon} size="md" weight="bold" />
                </MenuTrigger>
                <MenuContent aria-label="Actions" placement="left top">
                  {listViewProps.actions.one && (
                    <MenuItem
                      aria-label="View"
                      onAction={() => {
                        navigation.navigate(`./${listViewProps.slug}/${row.original.__id}`)
                      }}
                    >
                      View
                    </MenuItem>
                  )}
                  {listViewProps.actions.update && (
                    <MenuItem
                      aria-label="Edit"
                      onAction={() => {
                        navigation.navigate(`./${listViewProps.slug}/update/${row.original.__id}`)
                      }}
                    >
                      Edit
                    </MenuItem>
                  )}
                  {listViewProps.actions?.delete && (
                    <>
                      {listViewProps.actions.one ||
                        (listViewProps.actions.update && <MenuSeparator />)}
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
  }, [listViewProps.columns, listViewProps.actions, query.isLoading])

  const table = useCollectionListTable({
    total: query.data?.total,
    data: query.data?.data || [],
    columns: columns,
    listConfiguration: listViewProps.listConfiguration,
  })

  const isError = deleteMutation.isError || query.isError
  const isLoading = deleteMutation.isPending || query.isPending || query.isFetching

  return (
    <>
      <CollectionListToolbar
        actions={listViewProps.actions}
        slug={listViewProps.slug}
        onDelete={() => deleteMutation.mutate(rowSelectionIds)}
        isShowDeleteButton={isRowsSelected}
        isLoading={isLoading}
      />
      <TanstackTable
        table={table}
        loadingItems={pagination.pageSize}
        className="static"
        onRowClick="toggleSelect"
        isLoading={isLoading}
        isError={isError}
        configuration={listViewProps.listConfiguration}
      />
      <CollectionListPagination totalPage={query.data?.totalPage} />
    </>
  )
}
