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
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { toast } from 'sonner'

import type { FieldsClient } from '../../../core'
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
import { useServerFunction } from '../../providers/root'

interface ToolbarProps {
  slug: string
  searchValue: string
  onSearchChange: (value: string) => void
  isShowDeleteButton?: boolean
  onDelete?: () => void
}

const Toolbar = (props: ToolbarProps) => {
  const { slug, searchValue, onSearchChange, isShowDeleteButton = false, onDelete } = props
  return (
    <div className="flex items-center justify-between gap-x-3">
      <ButtonLink
        href="."
        variant="ghost"
        size="md"
        leadingIcon={<BaseIcon icon={CaretLeftIcon} size="md" />}
      >
        Back
      </ButtonLink>
      <div className="flex items-center gap-x-4">
        {isShowDeleteButton && (
          <Button
            variant="destruction"
            size="md"
            leadingIcon={<BaseIcon icon={TrashIcon} size="md" />}
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
        <TextField
          placeholder="Search"
          prefix={<BaseIcon icon={MagnifyingGlassIcon} size="md" />}
          className="w-full"
          aria-label="Search"
          value={searchValue}
          onChange={onSearchChange}
        />
        <Button variant="outline" size="md" leadingIcon={<BaseIcon icon={FunnelIcon} size="md" />}>
          Filter
        </Button>
        <ButtonLink variant="primary" size="md" href={`./${slug}/create`}>
          Create
        </ButtonLink>
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
}

export function ListTable(props: ListTableProps) {
  const navigation = useNavigation()
  const serverFunction = useServerFunction()
  const queryClient = useQueryClient()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [searchInput, setSearchInput] = useState('')

  // Debounce the search input by 500ms
  const debouncedSearch = useDebounce(searchInput, 500)

  const [pagination, setPagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(''),
    sortBy: parseAsString.withDefault(''),
    sortOrder: parseAsString.withDefault(''),
  })

  // Update pagination search when debounced search changes
  const [prevDebouncedSearch, setPrevDebouncedSearch] = useState(debouncedSearch)

  if (prevDebouncedSearch !== debouncedSearch) {
    setPagination({
      page: 1, // Reset page
      pageSize: pagination.pageSize,
      search: debouncedSearch,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
    })
    setPrevDebouncedSearch(debouncedSearch)
  }

  // Initialize sorting from URL
  const initialSorting: SortingState =
    pagination.sortBy && pagination.sortOrder
      ? [{ id: pagination.sortBy, desc: pagination.sortOrder === 'desc' }]
      : []

  const handleBulkDelete = async () => {
    const selectedRowIds = Object.keys(rowSelection).filter((key) => rowSelection[key])

    if (selectedRowIds.length === 0) return

    await serverFunction(`${props.slug}.delete`, {
      body: { ids: selectedRowIds },
      headers: {},
      pathParams: {},
      query: {},
    })

    setRowSelection({})
    // Invalidate the query
    await queryClient.invalidateQueries({
      queryKey: ['GET', `/api/${props.slug}`],
    })
    toast.success('Deletion successfully')
    navigation.refresh()
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
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            isSelected={table.getIsAllRowsSelected()}
            isIndeterminate={table.getIsSomeRowsSelected()}
            onChange={(checked) => table.getToggleAllRowsSelectedHandler()({ target: { checked } })}
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
      ...props.columns,
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
          <div className="grid place-items-center">
            <Menu>
              <MenuTrigger className="cursor-pointer">
                <BaseIcon icon={DotsThreeVerticalIcon} size="md" weight="bold" />
              </MenuTrigger>
              <MenuContent aria-label="Actions" placement="left top">
                <MenuItem
                  onAction={() => {
                    navigation.navigate(`./${props.slug}/${row.original.__id}`)
                  }}
                >
                  View
                </MenuItem>
                <MenuItem
                  onAction={() => {
                    navigation.navigate(`./${props.slug}/update/${row.original.__id}`)
                  }}
                >
                  Edit
                </MenuItem>
                <MenuSeparator />
                <MenuItem
                  isDanger
                  onAction={async () => {
                    await serverFunction(`${props.slug}.delete`, {
                      body: { ids: [row.original.__id] },
                      headers: {},
                      pathParams: {},
                      query: {},
                    })
                    // Invalidate the query
                    await queryClient.invalidateQueries({
                      queryKey: ['GET', `/api/${props.slug}`],
                    })
                    toast.success('Deletion successfully')
                    navigation.refresh()
                  }}
                >
                  Delete
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>
        ),
      }),
    ]
  }, [query.isLoading])

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
      sorting: initialSorting,
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
          sortBy: '',
          sortOrder: '',
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
      sorting: initialSorting,
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

  return (
    <>
      <Toolbar
        slug={props.slug}
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        isShowDeleteButton={Object.keys(rowSelection).some((key) => rowSelection[key])}
        onDelete={handleBulkDelete}
      />
      <TanstackTable
        table={table}
        loadingItems={pagination.pageSize}
        className="static"
        onRowClick="toggleSelect"
        isLoading={query.isLoading}
        isError={query.isError}
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
