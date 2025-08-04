'use client'

import React, { useRef } from 'react'

import {
  CaretDownIcon,
  CaretUpDownIcon,
  CaretUpIcon,
  EmptyIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr'
import {
  flexRender,
  type Row,
  type SortDirection,
  type Table as TanstackTableCore,
} from '@tanstack/react-table'
import clsx from 'clsx'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

type RowClickHandler<T> = (row: Row<T>, e: React.MouseEvent<HTMLTableCellElement>) => void

interface TanstackTableProps<T> {
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

export function TanstackTable<T>({
  className,
  classNames,
  table,
  isLoading = false,
  loadingItems = 5,
  isError = false,
  onRowClick: onRowClickProp,
  emptyFallback: emptyFallback,
  errorFallback,
}: TanstackTableProps<T>) {
  const errorMessage = 'An error occurred while loading data'
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
              const canSort = header.column.getCanSort()
              return (
                <TableHead
                  key={header.id}
                  className={clsx('focus-visible:ring-focus ring-inset', classNames?.tableHead)}
                  onClick={header.column.getToggleSortingHandler()}
                  colSpan={header.colSpan}
                  role={canSort ? 'button' : undefined}
                  tabIndex={canSort ? 0 : -1}
                >
                  <span className="inline-flex items-center gap-2 w-full">
                    <span className="flex-1">{children}</span>
                    {canSort && getSortIcon(header.column.getIsSorted())}
                  </span>
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className={classNames?.tableBody}>
        {isLoading ? (
          <TableLoading table={table} loadingItems={loadingItems} />
        ) : isError ? (
          <TableError table={table} errorFallback={errorFallback} errorMessage={errorMessage} />
        ) : table.getRowCount() === 0 ? (
          <TableEmpty table={table} emptyFallback={emptyFallback} emptyMessage={emptyMessage} />
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              className={classNames?.tableBodyRow}
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <TableCell
                    key={cell.id}
                    className={clsx(classNames?.tableCell)}
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

export const TableLoading = (props: {
  table: TanstackTableCore<any>
  loadingItems: number
  tableCell?: string
}) => {
  return Array.from({ length: props.loadingItems }).map((_, i) => (
    <TableRow key={i}>
      {props.table.getAllColumns().map((col, i) => (
        <TableCell key={i} className={clsx(props?.tableCell)}>
          {/* TODO: Skeleton */}
          Loading...
        </TableCell>
      ))}
    </TableRow>
  ))
}

export const TableError = (props: {
  table: TanstackTableCore<any>
  errorFallback?: React.ReactNode
  errorMessage?: React.ReactNode
}) => {
  return (
    <TableRow>
      <TableCell colSpan={props.table.getAllLeafColumns().length} className="h-32 text-center">
        {props.errorFallback ?? (
          <div className="flex flex-col items-center py-10 gap-spacing-16">
            <XIcon className="text-6xl size-auto text-input-text-placeholder" />
            <p className="text-body-l font-regular text-typo-secondary">
              {props.errorMessage ?? 'An error occurred while loading data'}
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
    <TableRow>
      <TableCell colSpan={props.table.getAllLeafColumns().length} className="h-24 text-center">
        {props.emptyFallback ?? (
          <div className="flex flex-col items-center py-10 gap-spacing-16">
            <EmptyIcon className="text-6xl size-auto text-input-text-placeholder" />
            <p className="text-body-l font-regular text-typo-secondary">
              {props.emptyMessage ?? 'No data'}
            </p>
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}
