'use client'

import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import {
  type CellContext,
  type ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Promisable } from 'type-fest'

import type { BaseData } from '../../../../../core/collection'
import {
  BaseIcon,
  Checkbox,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from '../../../../components'
import { useTanstackTableContext } from '../../../../providers/table'
import type { ListFeatures } from '../../types'

interface CollectionListTableArgs<TFieldsData extends BaseData> {
  listConfiguration?: {
    search?: (string | number | symbol)[]
    sortBy?: (string | number | symbol)[]
  }
  total?: number
  data: TFieldsData[]
  columns: ColumnDef<TFieldsData>[]
}

/**
 * @description A flexible hook for creating collection tables with sorting, pagination and row selection.
 * Provides unopinionated table functionality that can be customized for different collection data structures.
 */
export const useCollectionListTable = <TFieldsData extends BaseData>(
  args: CollectionListTableArgs<TFieldsData>
) => {
  const { pagination, setPagination, rowSelection, setRowSelection } = useTanstackTableContext()
  // Get default sort field from configuration
  const getDefaultSortField = () => {
    if (args.listConfiguration?.sortBy && args.listConfiguration.sortBy.length > 0) {
      return args.listConfiguration.sortBy[0].toString()
    }
    return ''
  }

  const table = useReactTable({
    data: args.data,
    columns: args.columns,
    enableMultiRowSelection: true,
    getRowId: (row) => row.__id.toString(),
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater
      setRowSelection(newSelection)
    },
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
        setPagination((prevPagination) => ({
          ...prevPagination,
          sortBy: sortConfig.id,
          sortOrder: sortConfig.desc ? 'desc' : 'asc',
        }))
      } else {
        setPagination((prevPagination) => ({
          ...prevPagination,
          sortBy: getDefaultSortField(),
          sortOrder: 'asc',
        }))
      }
    },
    // Pagination settings
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    rowCount: args.total ?? 0,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function'
          ? updater({ pageIndex: pagination.page - 1, pageSize: pagination.pageSize })
          : updater
      setPagination((prevPagination) => ({
        ...prevPagination,
        page: newPagination.pageIndex + 1,
      }))
    },
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

  return table
}

export interface EnhancedColumnsActions<TFieldsData extends BaseData> {
  columns: ColumnDef<TFieldsData>[]
  features?: ListFeatures
  onEdit?: (cellContext: CellContext<TFieldsData, unknown>) => Promisable<void>
  onDelete?: (cellContext: CellContext<TFieldsData, unknown>) => Promisable<void>
  onView?: (cellContext: CellContext<TFieldsData, unknown>) => Promisable<void>
}

/**
 * @description Generates enhanced table columns with selection checkboxes and action menu items based on provided features
 */
export const generateEnhancedColumns = <TFieldsData extends BaseData>(
  args: EnhancedColumnsActions<TFieldsData>
) => {
  const columnHelper = createColumnHelper<TFieldsData>()

  const selectionColumns = [
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
  ]

  const columns = [
    ...(args.features?.delete ? selectionColumns : []),
    ...args.columns,
    columnHelper.display({
      id: 'actions',
      cell: (cellContext) => {
        console.log(args.features)
        if (!args.features?.one && !args.features?.update && !args.features?.delete) {
          return null
        }
        return (
          <div className="grid place-items-center">
            <Menu>
              <MenuTrigger aria-label="Actions Icon" className="cursor-pointer">
                <BaseIcon icon={DotsThreeVerticalIcon} size="md" weight="bold" />
              </MenuTrigger>
              <MenuContent aria-label="Actions" placement="left top">
                {args.features?.one && (
                  <MenuItem
                    aria-label="View"
                    onAction={async () => {
                      await args.onView?.(cellContext)
                    }}
                  >
                    View
                  </MenuItem>
                )}
                {args.features?.update && (
                  <MenuItem
                    aria-label="Edit"
                    onAction={async () => {
                      await args.onEdit?.(cellContext)
                    }}
                  >
                    Edit
                  </MenuItem>
                )}
                {args.features?.delete && (
                  <>
                    {args.features?.one || (args.features?.update && <MenuSeparator />)}
                    <MenuItem
                      aria-label="Delete"
                      isDanger
                      onAction={async () => {
                        await args.onDelete?.(cellContext)
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

  return columns
}
