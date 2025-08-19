'use client'

import React, { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { useCollectionDelete } from './hooks/use-collection-delete'
import { useCollectionList } from './hooks/use-collection-list'
import { generateEnhancedColumns, useCollectionListTable } from './table'
import { CollectionListPagination } from './table/pagination'
import { CollectionListToolbar } from './toolbar'

import type { BaseData, FieldsClient } from '../../../../core'
import type { ListConfiguration } from '../../../../core/collection'
import { TanstackTable } from '../../../components'
import { useNavigation, useTanstackTableContext } from '../../../providers'
import { cn } from '../../../utils/cn'
import type { ListFeatures } from '../types'

interface ListTableProps<TFieldsClient extends FieldsClient, TFieldsData> {
  slug: string
  identifierColumn: string
  fieldsClient: TFieldsClient
  columns: ColumnDef<TFieldsData>[]
  listConfiguration?: ListConfiguration<any>
  features?: ListFeatures
}

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

export function ListViewClient<TFieldsClient extends FieldsClient, TFieldsData extends BaseData>(
  props: ListTableProps<TFieldsClient, TFieldsData>
) {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const { pagination, rowSelection, setRowSelection } = useTanstackTableContext()

  const selectedRowIds = Object.keys(rowSelection).filter((key) => rowSelection[key])

  const isShowDeleteButton = selectedRowIds.length > 0

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

  const columns = useMemo(() => {
    if (query.isLoading) return props.columns

    return generateEnhancedColumns({
      columns: props.columns,
      features: props.features,
      onDelete({ row }) {
        deleteMutation.mutate([row.original.__id.toString()])
      },
      onEdit({ row }) {
        navigation.navigate(`./${props.slug}/update/${row.original.__id}`)
      },
      onView({ row }) {
        navigation.navigate(`./${props.slug}/${row.original.__id}`)
      },
    })
  }, [props.columns, props.features, query.isLoading])

  const table = useCollectionListTable({
    total: query.data?.total,
    data: query.data?.data || [],
    columns: columns,
    listConfiguration: props.listConfiguration,
  })

  const handleBulkDelete = async () => {
    // Return immediately if delete is not enabled
    if (!props.features?.delete) return

    if (selectedRowIds.length === 0) return

    deleteMutation.mutate(selectedRowIds)
  }

  // Loading state
  const isLoading = deleteMutation.isPending || query.isLoading || query.isFetching
  const isError = deleteMutation.isError || query.isError

  return (
    <>
      <CollectionListToolbar
        features={props.features}
        slug={props.slug}
        onDelete={handleBulkDelete}
        isShowDeleteButton={isShowDeleteButton}
        isLoading={isLoading}
      />
      <TanstackTable
        table={table}
        loadingItems={pagination.pageSize}
        className="static"
        onRowClick="toggleSelect"
        isLoading={isLoading}
        isError={isError}
        configuration={props.listConfiguration}
      />
      <CollectionListPagination totalPage={query.data?.totalPage} />
    </>
  )
}
