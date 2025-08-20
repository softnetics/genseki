'use client'

import type React from 'react'

import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'

import type { BaseData } from '@genseki/react'
import {
  BaseIcon,
  Checkbox,
  CollectionListPagination,
  CollectionListToolbar,
  type InferFields,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  TanstackTable,
  toast,
  useClientListViewPropsContext,
  useCollectionDeleteMutation,
  useCollectionListQuery,
  useCollectionListTable,
  useNavigation,
  useTableStatesContext,
} from '@genseki/react'

import type { fields } from './posts'

type Post = InferFields<typeof fields>
const columnHelper = createColumnHelper<Post>()

export const columns = [
  columnHelper.group({
    id: 'id',
    header: () => <div className="flex items-center">ID</div>,
    columns: [
      columnHelper.accessor('__id', {
        header: () => <div className="flex items-center">ID</div>,
        cell: (info) => <div className="flex items-center">{info.getValue()}</div>,
      }),
      columnHelper.accessor('title', {
        header: () => <div className="">Title</div>,
        cell: (info) => info.getValue(),
      }),
    ],
  }),
  columnHelper.accessor('author.name', {
    header: 'Author Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('author.email', {
    header: 'Author Email',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated At',
    cell: (info) => <div>{new Date(info.getValue()).toLocaleDateString('en-GB')}</div>,
  }),
]

/**
 * @description This is an example how you can use the given `CollectionListToolbar` from Genseki,
 * you may use custom toolbar here whehter you want.
 */
export const PostClientToolbar = (props: { children?: React.ReactNode }) => {
  const listViewProps = useClientListViewPropsContext()
  const { rowSelection, setRowSelection } = useTableStatesContext()

  const selectedRowIds = Object.keys(rowSelection).filter((key) => rowSelection[key])

  const isShowDeleteButton = selectedRowIds.length > 0

  const queryClient = useQueryClient()

  const deleteMutation = useCollectionDeleteMutation({
    slug: listViewProps.slug,
    onSuccess: async () => {
      setRowSelection({})
      await queryClient.invalidateQueries({
        queryKey: ['GET', `/posts`],
      })
      toast.success('Deletion successfully')
    },
    onError: () => {
      toast.error('Failed to delete items')
    },
  })

  const handleBulkDelete = async () => {
    // Return immediately if delete is not enabled
    if (!listViewProps.actions?.delete) return

    if (selectedRowIds.length === 0) return

    deleteMutation.mutate(selectedRowIds)
  }

  return (
    <div>
      <CollectionListToolbar
        actions={listViewProps.actions}
        slug={listViewProps.slug}
        isShowDeleteButton={isShowDeleteButton}
        onDelete={handleBulkDelete}
      />
    </div>
  )
}

/**
 * @description This is an example how you can use the given `TanstackTable` and `CollectionListPagination` from Genseki to compose your view.
 */
export const PostClientTable = (props: { children?: React.ReactNode }) => {
  const listViewProps = useClientListViewPropsContext()
  const { setRowSelection } = useTableStatesContext()

  const queryClient = useQueryClient()

  const navigation = useNavigation()

  // Example of fethcing list data
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

  const columnHelper = createColumnHelper<BaseData>()
  // You can setup your own custom columns
  const enhancedColumns = [
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
              <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={(event) => {
                  const handler = row.getToggleSelectedHandler()
                  handler(event)
                }}
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
                {listViewProps.actions?.one && (
                  <MenuItem
                    aria-label="View"
                    onAction={() => {
                      navigation.navigate(`./${listViewProps.slug}/${row.original.__id}`)
                    }}
                  >
                    View
                  </MenuItem>
                )}
                {listViewProps.actions?.update && (
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
                    {listViewProps.actions?.one ||
                      (listViewProps.actions?.update && <MenuSeparator />)}
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
                <MenuSeparator />
                <MenuItem
                  aria-label="Revert"
                  onAction={() => {
                    confirm('Confirm to revert the action?')
                  }}
                >
                  Revert
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>
        )
      },
    }),
  ] as ColumnDef<{ __pk: string; __id: string }>[]

  const table = useCollectionListTable({
    total: query.data?.total,
    data: query.data?.data || [],
    columns: enhancedColumns,
    listConfiguration: listViewProps.listConfiguration,
  })

  return (
    <>
      <TanstackTable
        table={table}
        className="static"
        onRowClick="toggleSelect"
        isLoading={query.isLoading}
        isError={query.isError}
        configuration={listViewProps.listConfiguration}
      />
      <CollectionListPagination totalPage={query.data?.totalPage} />
    </>
  )
}
