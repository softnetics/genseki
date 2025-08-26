'use client'

import React, { useRef } from 'react'

import { CircleNotchIcon, WarningCircleIcon, WarningIcon } from '@phosphor-icons/react'
import { CaretDownIcon, CaretUpDownIcon, CaretUpIcon } from '@phosphor-icons/react/dist/ssr'
import {
  flexRender,
  type Row,
  type SortDirection,
  type Table as TanstackTableCore,
} from '@tanstack/react-table'
import clsx from 'clsx'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

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
    sortBy?: (string | number | symbol)[]
  }
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
              const canSort = configuration?.sortBy?.includes(header.column.id)
              return (
                <TableHead
                  key={header.id}
                  className={clsx(
                    'focus-visible:ring-focus ring-inset',
                    header.colSpan > 1 && 'border-bluegray-300 border-b',
                    classNames?.tableHead
                  )}
                  onClick={
                    canSort && children ? header.column.getToggleSortingHandler() : undefined
                  }
                  colSpan={header.colSpan}
                  role={canSort ? 'button' : undefined}
                  tabIndex={canSort ? 0 : -1}
                >
                  <span
                    className={clsx(
                      'inline-flex items-center gap-2 w-full',
                      header.colSpan > 1 && 'justify-center'
                    )}
                  >
                    <span>{children}</span>
                    {canSort && children && getSortIcon(header.column.getIsSorted())}
                  </span>
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className={clsx(classNames?.tableBody)}>
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
              className={clsx('border-b border-border last:border-b-0', classNames?.tableBodyRow)}
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
          <div className="flex flex-col items-center py-10 gap-8">
            <WarningCircleIcon
              className="text-xl size-auto text-input-text-placeholder"
              weight="fill"
            />
            <p className="text-base font-regular text-typo-secondary">
              {props.emptyMessage ?? 'No data'}
            </p>
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}
