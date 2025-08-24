'use client'

import type React from 'react'

import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'

import type { BaseData, CollectionLayoutProps } from '@genseki/react'
import {
  BaseIcon,
  Checkbox,
  CollectionListToolbar,
  type InferFields,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  TanstackTable,
  toast,
  useCollectionDeleteMutation,
  useCollectionList,
  useCollectionListQuery,
  useGenseki,
  useListTable,
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
export function PostClientToolbar() {
  const context = useCollectionList()

  return (
    <div>
      <CollectionListToolbar actions={context.actions} />
    </div>
  )
}

/**
 * @description This is an example how you can use the given `TanstackTable` and `CollectionListPagination` from Genseki to compose your view.
 */
export const PostClientTable = (props: { children?: React.ReactNode }) => {
  const context = useCollectionList()
  const { setRowSelection, debouncedSearch, debouncedFilter } = useTableStatesContext()

  const queryClient = useQueryClient()

  const navigation = useNavigation()

  // Example of fethcing list data
  const query = useCollectionListQuery({
    slug: context.slug,
    search: debouncedSearch,
    filter: debouncedFilter,
  })

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

  const columnHelper = createColumnHelper<BaseData>()
  // You can setup your own custom columns
  const enhancedColumns = [
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
                {context.actions?.one && (
                  <MenuItem
                    aria-label="View"
                    onAction={() => {
                      navigation.navigate(`./${context.slug}/${row.original.__id}`)
                    }}
                  >
                    View
                  </MenuItem>
                )}
                {context.actions?.update && (
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
                    {context.actions?.one || (context.actions?.update && <MenuSeparator />)}
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
  ]

  const table = useListTable({
    total: query.data?.total,
    data: query.data?.data || [],
    columns: enhancedColumns,
  })

  console.log('Inside query >>> ', query.data)

  return (
    <>
      <TanstackTable
        table={table}
        className="static"
        onRowClick="toggleSelect"
        isLoading={query.isLoading}
        isError={query.isError}
        configuration={{
          sortBy: context.sortBy,
        }}
      />
    </>
  )
}

export function Layout(props: CollectionLayoutProps) {
  const {
    components: { AppTopbar, AppSidebar, AppSidebarInset, AppSidebarProvider },
  } = useGenseki()

  return (
    <AppSidebarProvider>
      <AppSidebar />
      <AppSidebarInset>
        <AppTopbar />
        {props.children}
      </AppSidebarInset>
    </AppSidebarProvider>
  )
}

export function Page() {
  const {
    components: {
      ListBanner,
      ListTableContainer,
      ListTablePagination,
      ListTable,
      ListTableToolbar,
    },
  } = useCollectionList<Post>()

  return (
    <>
      <ListBanner />
      <ListTableContainer>
        <PostClientToolbar />
        <PostClientTable />
        <ListTablePagination />
      </ListTableContainer>
    </>
  )
}
