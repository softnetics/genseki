'use client'

import type React from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'

import type { ListConfiguration } from '@genseki/react'
import {
  CollectionListPagination,
  CollectionListToolbar,
  generateEnhancedColumns,
  type InferFields,
  type ListFeatures,
  TanstackTable,
  toast,
  useCollectionDelete,
  useCollectionList,
  useCollectionListTable,
  useNavigation,
  useTanstackTableContext,
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
export const PostClientToolbar = (props: {
  children?: React.ReactNode
  slug: string
  features: ListFeatures
}) => {
  const { rowSelection, setRowSelection } = useTanstackTableContext()

  const selectedRowIds = Object.keys(rowSelection).filter((key) => rowSelection[key])

  const isShowDeleteButton = selectedRowIds.length > 0

  const queryClient = useQueryClient()

  const deleteMutation = useCollectionDelete({
    slug: props.slug,
    onSuccess: async () => {
      setRowSelection({})
      await queryClient.invalidateQueries({
        queryKey: ['GET', `/api/posts`],
      })
      toast.success('Deletion successfully')
    },
    onError: () => {
      toast.error('Failed to delete items')
    },
  })

  const handleBulkDelete = async () => {
    // Return immediately if delete is not enabled
    if (!props.features?.delete) return

    if (selectedRowIds.length === 0) return

    deleteMutation.mutate(selectedRowIds)
  }

  return (
    <div>
      <CollectionListToolbar
        features={props.features}
        slug={props.slug}
        isShowDeleteButton={isShowDeleteButton}
        onDelete={handleBulkDelete}
      />
    </div>
  )
}

/**
 * @description This is an example how you can use the given `TanstackTable` and `CollectionListPagination` from Genseki to compose your view.
 */
export const PostClientTable = (props: {
  slug: string
  children?: React.ReactNode
  columns: ColumnDef<any>[]
  listConfiguration?: ListConfiguration<any>
  features?: ListFeatures
}) => {
  const { setRowSelection } = useTanstackTableContext()

  const queryClient = useQueryClient()

  const navigation = useNavigation()

  // Example of fethcing list data
  const query = useCollectionList({ slug: props.slug })

  const deleteMutation = useCollectionDelete({
    slug: props.slug,
    onSuccess: async () => {
      setRowSelection({})
      await queryClient.invalidateQueries({
        queryKey: ['GET', `/api/${props.slug}`],
      })
      toast.success('Deletion successfully')
    },
    onError: () => {
      toast.error('Failed to delete items')
    },
  })

  // generateEnhancedColumns will give you more additional columns
  // 1.row selection column
  // 2.update / delete / view actions column
  const enhancedColumns = generateEnhancedColumns({
    columns: props.columns,
    features: props.features,
    onDelete({ row }) {
      // You can attach more actions here
      deleteMutation.mutate([row.original.__id.toString()])
    },
    onEdit({ row }) {
      navigation.navigate(`./${props.slug}/update/${row.original.__id}`)
    },
    onView({ row }) {
      navigation.navigate(`./${props.slug}/${row.original.__id}`)
    },
  })

  const table = useCollectionListTable({
    total: query.data?.total,
    data: query.data?.data || [],
    columns: enhancedColumns,
    listConfiguration: props.listConfiguration,
  })

  return (
    <>
      <TanstackTable
        table={table}
        className="static"
        onRowClick="toggleSelect"
        isLoading={query.isLoading}
        isError={query.isError}
        configuration={props.listConfiguration}
      />
      <CollectionListPagination totalPage={query.data?.totalPage} />
    </>
  )
}
