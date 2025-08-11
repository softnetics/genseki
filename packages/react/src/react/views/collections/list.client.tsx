'use client'

import { useMemo, useState } from 'react'

import {
  CaretLeftIcon,
  DotsThreeVerticalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from '@phosphor-icons/react/dist/ssr'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import {
  type ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  useReactTable,
} from '@tanstack/react-table'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { toast } from 'sonner'

import type { ListFeatures } from './types'

import type { Fields, FieldsClient } from '../../../core'
import type { ListConfiguration } from '../../../core/collection'
import {
  Button,
  ButtonLink,
  Checkbox,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  PageSizeSelect,
  Pagination,
  TextField,
} from '../../components'
import { BaseIcon } from '../../components/primitives/base-icon'
import { TanstackTable } from '../../components/primitives/tanstack-table'
import { useDebounce } from '../../hooks/use-debounce'
import { useNavigation } from '../../providers'

interface ToolbarProps {
  slug: string
  searchValue: string
  onSearchChange: (value: string) => void
  isLoading?: boolean
  isShowDeleteButton?: boolean
  onDelete?: () => void
  features?: ListFeatures
}

const Toolbar = (props: ToolbarProps) => {
  const {
    slug,
    searchValue,
    onSearchChange,
    isShowDeleteButton = false,
    onDelete,
    isLoading = false,
    features,
  } = props
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
        {features?.delete && isShowDeleteButton && (
          <Button
            aria-label="Delete"
            variant="destruction"
            size="md"
            leadingIcon={<BaseIcon icon={TrashIcon} size="md" />}
            onClick={onDelete}
            isPending={isLoading}
          >
            Delete
          </Button>
        )}
        <TextField
          aria-label="Search"
          placeholder="Search"
          prefix={<BaseIcon icon={MagnifyingGlassIcon} size="md" />}
          className="w-full"
          value={searchValue}
          isPending={isLoading}
          onChange={onSearchChange}
        />
        <Button
          aria-label="Filter"
          variant="outline"
          size="md"
          leadingIcon={<BaseIcon icon={FunnelIcon} size="md" />}
          isPending={isLoading}
        >
          Filter
        </Button>
        {features?.create && (
          <ButtonLink
            aria-label="Create"
            variant="primary"
            size="md"
            href={`./${slug}/create`}
            isPending={isLoading}
          >
            Create
          </ButtonLink>
        )}
      </div>
    </div>
  )
}

type BaseData = {
  __id: string
  __pk: string
} & {}

interface ListTableProps {
  slug: string
  identifierColumn: string
  fields: FieldsClient
  columns: ColumnDef<BaseData>[]
  listConfiguration?: ListConfiguration<Fields>
  features?: ListFeatures
}

export function ListTable(props: ListTableProps) {
  const navigation = useNavigation()
  const queryClient = useQueryClient()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [searchInput, setSearchInput] = useState('')

  const [pagination, setPagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    search: parseAsString,
    sortBy: parseAsString,
    sortOrder: parseAsString,
  })

  const handleDebouncedSearch = (debouncedSearch: string) => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      search: debouncedSearch,
    }))
  }

  // Debounce the search input by 500ms
  useDebounce(searchInput, handleDebouncedSearch, 500)

  // Get default sort field from configuration
  const getDefaultSortField = () => {
    if (props.listConfiguration?.sortBy && props.listConfiguration.sortBy.length > 0) {
      return props.listConfiguration.sortBy[0]
    }
    return ''
  }

  // Delete mutation
  const deleteMutation = useMutation({
    // TODO: path prefix should be provided from App Config
    mutationKey: ['DELETE', `/api/${props.slug}`],
    mutationFn: async (selectedRowIds: string[]) => {
      return fetch(`/api/${props.slug}`, {
        method: 'DELETE',
        body: JSON.stringify({ ids: selectedRowIds }),
        headers: { 'Content-Type': 'application/json' },
      const res = await fetch(`/api/${props.slug}`, {
        method: 'DELETE',
        body: JSON.stringify({ ids: selectedRowIds }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to delete items');
      }
      return data;
    },
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

  const handleBulkDelete = async () => {
    // Return immediately if delete is not enabled
    if (!props.features?.delete) return

    const selectedRowIds = Object.keys(rowSelection).filter((key) => rowSelection[key])

    if (selectedRowIds.length === 0) return

    deleteMutation.mutate(selectedRowIds)
  }

  const query: UseQueryResult<{
    data: BaseData[]
    total: number
    totalPage: number
    currentPage: number
  }> = useQuery({
    queryKey: ['GET', `/api/${props.slug}`, { query: pagination }] as const,
    queryFn: async (context) => {
      const [, , payload] = context.queryKey
      const params = new URLSearchParams([
        ['pageSize', payload.query.pageSize.toString()],
        ['page', payload.query.page.toString()],
      ])

      // Add search parameter if it exists
      if (payload.query.search && payload.query.search.trim()) {
        params.append('search', payload.query.search.trim())
      }

      // Add sorting parameters if they exist
      if (payload.query.sortBy && payload.query.sortOrder) {
        params.append('sortBy', payload.query.sortBy)
        params.append('sortOrder', payload.query.sortOrder)
      }

      return fetch(`/api/${props.slug}?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => data.body)
    },
    placeholderData: keepPreviousData,
  })

  const enhancedColumns = useMemo(() => {
    const columnHelper = createColumnHelper<BaseData>()
    if (query.isLoading) return props.columns
    return [
      // Only show checkbox if delete is enabled
      ...(props.features?.delete
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
      ...props.columns,
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => {
          if (!props.features?.one && !props.features?.update && !props.features?.delete) {
            return null
          }
          return (
            <div className="grid place-items-center">
              <Menu>
                <MenuTrigger aria-label="Actions Icon" className="cursor-pointer">
                  <BaseIcon icon={DotsThreeVerticalIcon} size="md" weight="bold" />
                </MenuTrigger>
                <MenuContent aria-label="Actions" placement="left top">
                  {props.features?.one && (
                    <MenuItem
                      aria-label="View"
                      onAction={() => {
                        navigation.navigate(`./${props.slug}/${row.original.__id}`)
                      }}
                    >
                      View
                    </MenuItem>
                  )}
                  {props.features?.update && (
                    <MenuItem
                      aria-label="Edit"
                      onAction={() => {
                        navigation.navigate(`./${props.slug}/update/${row.original.__id}`)
                      }}
                    >
                      Edit
                    </MenuItem>
                  )}
                  {props.features?.delete && (
                    <>
                      {props.features?.one || (props.features?.update && <MenuSeparator />)}
                      <MenuItem
                        aria-label="Delete"
                        isDanger
                        onAction={() => {
                          deleteMutation.mutate([row.original.__id])
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
    ]
  }, [query.isLoading, props.features])

  const table = useReactTable({
    data: query.data?.data ?? [],
    columns: enhancedColumns,
    enableMultiRowSelection: true,
    getRowId: (row) => row.__id,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    // Sorting settings
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    initialState: {
      sorting: [{ id: getDefaultSortField(), desc: true }],
    },
    onSortingChange: (updater) => {
      const currentSorting = table?.getState().sorting
      const newSorting = typeof updater === 'function' ? updater(currentSorting) : updater

      if (newSorting.length > 0) {
        const sortConfig = newSorting[0]
        setPagination({
          page: pagination.page,
          pageSize: pagination.pageSize,
          search: pagination.search,
          sortBy: sortConfig.id,
          sortOrder: sortConfig.desc ? 'desc' : 'asc',
        })
      } else {
        setPagination({
          page: pagination.page,
          pageSize: pagination.pageSize,
          search: pagination.search,
          sortBy: getDefaultSortField(),
          sortOrder: 'asc',
        })
      }
    },

    // Pagination settings
    manualPagination: true,
    rowCount: query.data?.total ?? 0,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function'
          ? updater({ pageIndex: pagination.page - 1, pageSize: pagination.pageSize })
          : updater
      setPagination({
        page: newPagination.pageIndex + 1,
        pageSize: newPagination.pageSize,
        search: pagination.search,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
      })
    },
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
      sorting: [
        { id: pagination.sortBy ?? getDefaultSortField(), desc: pagination.sortOrder === 'desc' },
      ],
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
    },
  })

  // Handle search change
  const handleSearchChange = (searchValue: string) => {
    setSearchInput(searchValue)
  }

  // Loading state
  const isLoading = deleteMutation.isPending || query.isLoading || query.isFetching
  const isShowDeleteButton = Object.keys(rowSelection).some((key) => rowSelection[key])

  return (
    <>
      <Toolbar
        slug={props.slug}
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        isLoading={isLoading}
        isShowDeleteButton={isShowDeleteButton}
        onDelete={handleBulkDelete}
        features={props.features}
      />
      <TanstackTable
        table={table}
        loadingItems={pagination.pageSize}
        className="static"
        onRowClick="toggleSelect"
        isLoading={isLoading}
        isError={query.isError}
        configuration={props.listConfiguration}
      />
      <div className="flex flex-row items-center justify-between gap-x-4 mt-6">
        <div>
          <Pagination
            currentPage={pagination.page}
            totalPages={query.data?.totalPage ?? 0}
            onPageChange={(page) =>
              setPagination((pagination) => ({ page: page, pageSize: pagination.pageSize }))
            }
          />
        </div>
        <div className="flex items-center gap-x-6">
          <p className="text-base text-muted-fg font-bold">
            <span className="font-normal">Page </span>
            {pagination.page}
            <span className="font-normal"> of </span>
            {query.data?.totalPage ? query.data.totalPage : 1}
          </p>
          <PageSizeSelect
            pageSize={pagination.pageSize}
            onPageSizeChange={(pageSize) => setPagination(() => ({ page: 1, pageSize }))}
          />
        </div>
      </div>
    </>
  )
}
