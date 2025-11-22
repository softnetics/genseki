'use client'

import React, { type CSSProperties, useRef } from 'react'

import { CircleNotchIcon, WarningCircleIcon, WarningIcon } from '@phosphor-icons/react'
import { CaretDownIcon, CaretUpDownIcon, CaretUpIcon } from '@phosphor-icons/react/dist/ssr'
import {
  type Column,
  flexRender,
  type Row,
  type SortDirection,
  type Table as TanstackTableCore,
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

import { Typography } from '../../../../v2'
import { cn } from '../../utils/cn'

type RowClickHandler<T> = (row: Row<T>, e: React.MouseEvent<HTMLTableCellElement>) => void

export interface TanstackTableProps<T> {
  className?: string
  classNames?: {
    tableContainer?: string
    tableHeader?: string
    tableHead?: string
    tableHeadRow?: string
    tableBody?: string
    tableCell?: string
    tableBodyRow?: string
  }
  table: TanstackTableCore<T>
  isLoading?: boolean
  loadingItems?: number
  isError?: boolean
  onRowClick?: 'toggleSelect' | RowClickHandler<T>
  errorFallback?: React.ReactNode
  errorMessage?: React.ReactNode
  emptyFallback?: React.ReactNode
  emptyMessage?: React.ReactNode
  configuration?: {
    sortBy?: ([string, 'asc' | 'desc'] | [string])[]
  }
}

const getCommonPinningClassesAndStyle = (column: Column<any>) => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

  const className = cn(
    isPinned ? 'sticky z-[1]' : 'relative',
    isLastLeftPinnedColumn && 'shadow-[inset_-4px_0_4px_-4px_gray]',
    isFirstRightPinnedColumn && 'shadow-[inset_4px_0_4px_-4px_gray]'
  )

  const style: CSSProperties = {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
  }

  return { className, style }
}

export const getSortIcon = (isSorted: false | SortDirection) => {
  switch (isSorted) {
    case false:
      return <CaretUpDownIcon className="size-8 cursor-pointer" weight="fill" />
    case 'asc':
      return <CaretUpIcon className="size-8 cursor-pointer" weight="fill" />
    case 'desc':
      return <CaretDownIcon className="size-8 cursor-pointer" weight="fill" />
  }
}

const normalizeColumnId = (id: string) => id.replace(/_/g, '.')

export function TanstackTable<T>({
  className,
  classNames,
  table,
  isLoading = false,
  // loadingItems = 5,
  isError = false,
  onRowClick: onRowClickProp,
  emptyFallback: emptyFallback,
  errorFallback,
  configuration,
}: TanstackTableProps<T>) {
  const errorMessage = 'Error'
  const emptyMessage = 'No data'

  const containerRef = useRef<HTMLTableElement>(null)

  const onRowClick =
    onRowClickProp === 'toggleSelect'
      ? (() => {
          const handler: RowClickHandler<T> = (row, e) => row.getToggleSelectedHandler()(e)
          return handler
        })()
      : onRowClickProp

  return (
    <Table ref={containerRef} className={className}>
      <TableHeader className={classNames?.tableHeader}>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className={classNames?.tableHeadRow}>
            {headerGroup.headers.map((header) => {
              const children = header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())
              // const canSort = header.column.getCanSort()
              const canSort = configuration?.sortBy?.some(
                ([columnPath]) => columnPath === normalizeColumnId(header.column.id)
              )
              const { className: pinnedHeaderClassName, style: pinnedHeaderStyle } =
                getCommonPinningClassesAndStyle(header.column)
              return (
                <TableHead
                  key={normalizeColumnId(header.id)}
                  className={cn(
                    'focus-visible:ring-focus ring-inset',
                    header.colSpan > 1 && 'border-bluegray-300 border-b',
                    classNames?.tableHead,
                    pinnedHeaderClassName,
                    header.column.columnDef.meta?.thClassName
                  )}
                  style={pinnedHeaderStyle}
                  onClick={
                    canSort && children ? header.column.getToggleSortingHandler() : undefined
                  }
                  colSpan={header.colSpan}
                  role={canSort ? 'button' : undefined}
                  tabIndex={canSort ? 0 : -1}
                >
                  <div
                    className={cn(
                      'inline-flex items-center gap-2 w-full',
                      header.colSpan > 1 && 'justify-center'
                    )}
                  >
                    <Typography
                      type="caption"
                      weight="semibold"
                      className="text-text-tertiary"
                      asChild
                    >
                      <span>{children}</span>
                    </Typography>
                    {canSort && children && getSortIcon(header.column.getIsSorted())}
                  </div>
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className={cn(classNames?.tableBody)}>
        {isLoading ? (
          <TableLoading table={table} />
        ) : isError ? (
          <TableError table={table} errorFallback={errorFallback} errorMessage={errorMessage} />
        ) : table.getRowCount() === 0 ? (
          <TableEmpty table={table} emptyFallback={emptyFallback} emptyMessage={emptyMessage} />
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              className={cn('border-b border-border last:border-b-0', classNames?.tableBodyRow)}
            >
              {row.getVisibleCells().map((cell) => {
                const { className: pinnedCellClassName, style: pinnedCellStyle } =
                  getCommonPinningClassesAndStyle(cell.column)
                return (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      classNames?.tableCell,
                      pinnedCellClassName,
                      cell.column.columnDef.meta?.tdClassName
                    )}
                    style={pinnedCellStyle}
                    onClick={(e) => onRowClick?.(row, e)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

export const TableLoading = (props: { table: TanstackTableCore<any> }) => {
  return (
    <TableRow className="h-[560px]">
      <TableCell colSpan={props.table.getAllLeafColumns().length} className="h-32 text-center">
        <div className="flex flex-col items-center py-10 gap-8">
          <CircleNotchIcon className="text-xl size-auto text-input-text-placeholder animate-spin" />
          <p className="text-base font-regular text-typo-secondary">Loading</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

export const TableError = (props: {
  table: TanstackTableCore<any>
  errorFallback?: React.ReactNode
  errorMessage?: React.ReactNode
}) => {
  return (
    <TableRow className="h-[560px]">
      <TableCell colSpan={props.table.getAllLeafColumns().length} className="h-32 text-center">
        {props.errorFallback ?? (
          <div className="flex flex-col items-center py-10 gap-8">
            <WarningIcon className="text-xl size-auto text-input-text-placeholder" weight="fill" />
            <p className="text-base font-regular text-typo-secondary">
              {props.errorMessage ?? 'Error'}
            </p>
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}
export const TableEmpty = (props: {
  table: TanstackTableCore<any>
  emptyFallback?: React.ReactNode
  emptyMessage?: React.ReactNode
}) => {
  return (
    <TableRow className="h-[560px]">
      <TableCell colSpan={props.table.getAllLeafColumns().length} className="h-24 text-center">
        {props.emptyFallback ?? (
          <div className="flex flex-col items-center py-10 gap-5">
            <WarningCircleIcon
              className="text-xl size-auto text-input-text-placeholder"
              weight="regular"
            />
            <Typography>{props.emptyMessage ?? 'No data'}</Typography>
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}
