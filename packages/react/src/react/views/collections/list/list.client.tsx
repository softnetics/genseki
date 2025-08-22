'use client'

import React, { useMemo } from 'react'

import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'

import { Banner } from './banner'
import { useListTable } from './table'
import { CollectionListPagination } from './table/pagination'
import { CollectionListToolbar } from './toolbar'

import type { BaseData } from '../../../../core'
import { useCollectionList } from '../../../../core/collection/list/context'
import {
  BaseIcon,
  Checkbox,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  TanstackTable,
  type TanstackTableProps,
} from '../../../components'
import { useNavigation } from '../../../providers'
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

export interface CollectionListTableProps<T extends BaseData>
  extends Omit<TanstackTableProps<T>, 'table' | 'configuration'> {
  total?: number
  data?: T[]
  columns?: ColumnDef<T, any>[]
  search?: string[]
  sortBy?: string[]

  isLoading?: boolean
  isError?: boolean
}

export function CollectionListTable<T extends BaseData>(props: CollectionListTableProps<T>) {
  const context = useCollectionList()

  const table = useListTable({
    total: props.total ?? context.total,
    data: props.data ?? context.data ?? [],
    columns: props.columns ?? context.columns,
    search: props.search ?? context.search,
    sortBy: props.sortBy ?? context.sortBy,
  })

  return (
    <TanstackTable
      table={table}
      loadingItems={table.getTotalSize()}
      className="static"
      onRowClick="toggleSelect"
      isLoading={props.isLoading ?? context.isQuerying ?? context.isMutating}
      isError={props.isError ?? context.isError}
      configuration={{
        search: props.search ?? context.search,
        sortBy: props.sortBy ?? context.sortBy,
      }}
      {...props}
    />
  )
}

export function DefaultCollectionListPage() {
  const navigation = useNavigation()

  const context = useCollectionList()

  const columns = useMemo(() => {
    if (context.isQuerying) return context.columns

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
                      <MenuItem aria-label="Delete" isDanger onAction={context.deleteRows}>
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
  }, [context.columns, context.actions, context.isQuerying])

  return (
    <>
      <Banner slug={context.slug} />
      <CollectionListTableContainer>
        <CollectionListToolbar />
        <CollectionListTable<any> columns={columns} />
        <CollectionListPagination />
      </CollectionListTableContainer>
    </>
  )
}
