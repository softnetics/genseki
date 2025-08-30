'use client'

import React, { useMemo } from 'react'

import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'

import { Banner } from './banner'
import { CollectionListTableContainer } from './container'
import { useCollectionList } from './context'
import { CollectionListTable } from './table'
import { CollectionListPagination } from './table/pagination'
import { CollectionListToolbar } from './toolbar'

import {
  BaseIcon,
  Checkbox,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from '../../../components'
import { useNavigation } from '../../../providers'
import type { BaseData } from '../types'

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
                      <MenuItem
                        aria-label="Delete"
                        isDanger
                        onAction={() => context.deleteRows([row.original.__id as string])}
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
