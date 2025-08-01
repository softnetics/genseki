'use client'

import type { CSSProperties, RefObject } from 'react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { CaretDownIcon, CaretUpDownIcon, CaretUpIcon } from '@phosphor-icons/react'
import { EmptyIcon, XIcon } from '@phosphor-icons/react/dist/ssr'
import {
  type Column,
  flexRender,
  type OnChangeFn,
  type Row,
  type RowSelectionState,
  type SortDirection,
  type Table as TanstackTableCore,
} from '@tanstack/react-table'
import clsx from 'clsx'

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from './table'

type RowClickHandler<T> = (row: Row<T>) => void

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
          const handler: RowClickHandler<T> = (row) => row.getToggleSelectedHandler()(row)
          return handler
        })()
      : onRowClickProp

  return (
    <Table bleed ref={containerRef} className={`rounded-lg overflow-hidden ${className}`}>
      <TableHeader className={classNames?.tableHeader}>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className={classNames?.tableHeadRow}>
            {headerGroup.headers.map((header) => {
              const children = header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())
              const canSort = header.column.getCanSort()
              return (
                <TableColumn
                  isRowHeader
                  key={header.id}
                  className={clsx(
                    'focus-visible:ring-focus ring-inset px- shrink-0',
                    classNames?.tableHead
                  )}
                  // colSpan={header.colSpan}
                  // allowsSorting={canSort}
                >
                  <span
                    className="inline-flex items-center gap-2"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {children}
                    {canSort && getSortIcon(header.column.getIsSorted())}
                  </span>
                </TableColumn>
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
              onAction={() => onRowClick?.(row)}
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <TableCell key={cell.id} className={clsx(classNames?.tableCell)}>
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

export function useSingleSelectionAdapter(
  value: string | null,
  setValue: (value: string | null) => void
) {
  const rowSelection = value ? { [value]: true } : {}
  const setRowSelection: OnChangeFn<RowSelectionState> = useCallback(
    (updaterOrValue) => {
      let selection: RowSelectionState = {}
      if (typeof updaterOrValue === 'function') {
        selection = updaterOrValue({})
      } else {
        selection = updaterOrValue
      }
      const selectedId = Object.keys(selection).find((id) => selection[id]) ?? null
      setValue(selectedId)
    },
    [setValue]
  )
  return [rowSelection, setRowSelection] as const
}

// belows are not used

function _getCommonPinningProps(column: Column<any>) {
  const isPinned = column.getIsPinned()
  const style: CSSProperties = {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : undefined,
    minWidth: isPinned ? column.getSize() : undefined,
    zIndex: isPinned ? 1 : undefined,
  }
  return { style, 'data-pinned': !!isPinned }
}

function _Shadow(props: {
  table: TanstackTableCore<any>
  containerRef: RefObject<HTMLDivElement>
}) {
  const [scrolledToStart, setScrolledToStart] = useState(true)
  const [scrolledToEnd, setScrolledToEnd] = useState(true)

  useEffect(() => {
    const container = props.containerRef.current
    if (!container) return

    const onScroll = () => {
      setScrolledToStart(container.scrollLeft <= 0)
      setScrolledToEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth)
    }
    onScroll()

    container.addEventListener('scroll', onScroll)
    container.addEventListener('resize', onScroll)
    return () => {
      container.removeEventListener('scroll', onScroll)
      container.removeEventListener('resize', onScroll)
      setScrolledToStart(true)
      setScrolledToEnd(true)
    }
  }, [])

  return (
    <>
      <PinnedShadow table={props.table} position="left" isFloating={!scrolledToStart} />
      <PinnedShadow table={props.table} position="right" isFloating={!scrolledToEnd} />
    </>
  )
}

function PinnedShadow({
  position,
  table,
  isFloating,
}: {
  position: 'left' | 'right'
  table: TanstackTableCore<any>
  isFloating: boolean
}) {
  if (!table.getIsSomeColumnsPinned(position)) return
  const column = table.getColumn(table.getState().columnPinning[position]?.at(-1) ?? '')
  if (!column) return null
  const width = column.getStart(position) + column.getSize() + 0.5
  return (
    <tbody className="absolute flex top-0 left-0 h-full w-full pointer-events-none">
      {position === 'right' && <tr className="block flex-1" />}
      <tr
        className={clsx(
          // TODO: change bg border color
          'sticky block h-full bg-border-outline transition-shadow shadow-none data-[floating=true]:shadow-[0px_10px_20px_0px_#00000033]',
          position === 'left' ? 'left-0' : 'right-0'
        )}
        data-floating={isFloating}
        style={{ width: `${width}px` }}
      />
    </tbody>
  )
}
