import { CSSProperties, ReactNode, RefObject, useEffect, useRef, useState } from 'react'

import { flexRender } from '@tanstack/react-table'
import { Column, Header, Table as TanstackTable } from '@tanstack/react-table'
import { twMerge } from 'tailwind-merge'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

interface CustomTableProps<T> {
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
  styles?: {
    tableContainer?: CSSProperties
  }
  table: TanstackTable<T>
  horizontalBorders?: boolean
  isLoading?: boolean
  isError?: boolean
  footer?: React.ReactNode
  children?: React.ReactNode
}

export function CustomTable<T>({
  className,
  classNames,
  styles,
  table,
  horizontalBorders = false,
  isLoading = false,
  isError = false,
  footer,
  children,
}: CustomTableProps<T>) {
  const defaultTableClassName = 'bg-surface'
  const defaultHeadClassName = 'data-[pinned=true]:bg-surface-container'
  const defaultCellClassName = 'data-[pinned=true]:bg-[inherit]'

  const containerRef = useRef<HTMLDivElement>(null)
  const [scrolledToStart, setScrolledToStart] = useState(true)
  const [scrolledToEnd, setScrolledToEnd] = useState(true)

  useEffect(() => {
    const container = containerRef.current
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

  const skipHeaderIds = new Set<string>()
  function collapsePlaceholders<T>(header: Header<T, unknown>) {
    let current = header
    let rowSpan = 1
    while (current.isPlaceholder && current.subHeaders.length === 1) {
      current = current.subHeaders[0]!
      skipHeaderIds.add(current.id)
      rowSpan++
    }
    return { header: current, rowSpan }
  }

  return (
    <Table
      containerRef={containerRef}
      containerClassName={classNames?.tableContainer}
      className={twMerge(defaultTableClassName, className)}
      containerStyle={styles?.tableContainer}
    >
      <TableHeader className={classNames?.tableHeader}>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className={classNames?.tableHeadRow}>
            {headerGroup.headers.map((_header) => {
              if (skipHeaderIds.has(_header.id)) return null
              const { header, rowSpan } = collapsePlaceholders(_header)
              const thClassName = header.index === 0 ? '' : 'border-l'
              const canSort = header.column.getCanSort()
              const children = header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())
              if (canSort) {
                return (
                  <th
                    key={header.id}
                    className={twMerge(
                      'h-0 p-0',
                      thClassName,
                      defaultHeadClassName
                      // header.column.columnDef.meta?.headContainerClassName
                    )}
                    colSpan={header.colSpan}
                    rowSpan={rowSpan}
                    {...getCommonPinningProps(header.column)}
                  >
                    <TableHead
                      className={twMerge(
                        'h-full transition-colors hover:text-text-on-primary-container',
                        classNames?.tableHead
                        // header.column.columnDef.meta?.headContainerClassName,
                        // header.column.columnDef.meta?.headClassName
                      )}
                      asChild
                    >
                      <button
                        type="button"
                        className="w-full h-full flex justify-between items-center gap-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:ring-offset-0"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {children}
                        {/* {canSort && (
                          <ButtonRightIcon className="ml-auto">
                            <FontAwesomeIcon icon={getSortIcon(header.column.getIsSorted())} />
                          </ButtonRightIcon>
                        )} */}
                      </button>
                    </TableHead>
                  </th>
                )
              }
              return (
                <TableHead
                  key={header.id}
                  className={twMerge(
                    defaultHeadClassName,
                    thClassName,
                    classNames?.tableHead
                    // header.column.columnDef.meta?.headClassName
                  )}
                  colSpan={header.colSpan}
                  rowSpan={rowSpan}
                  {...getCommonPinningProps(header.column)}
                >
                  {children}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className={classNames?.tableBody}>
        {isLoading ? (
          <TableEmptyState
            containerRef={containerRef as any}
            colSpan={table.getAllLeafColumns().length}
          >
            <div className="sticky left-0 flex justify-center py-20">Loading...</div>
          </TableEmptyState>
        ) : isError ? (
          <TableEmptyState
            containerRef={containerRef as any}
            colSpan={table.getAllLeafColumns().length}
          >
            <div className="h-32 flex items-center justify-center text-center text-system-error">
              Error
            </div>
          </TableEmptyState>
        ) : table.getRowModel().rows?.length ? (
          <>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={twMerge('bg-surface', classNames?.tableBodyRow)}
                horizontalBorders={horizontalBorders}
              >
                {row.getVisibleCells().map((cell) => {
                  // const interactive = columnDef.meta?.interactive ?? columnDef.id === 'actions'

                  return (
                    <TableCell
                      key={cell.id}
                      className={twMerge(
                        defaultCellClassName,
                        classNames?.tableCell
                        // cell.column.columnDef.meta?.cellClassName
                      )}
                      // onClick={interactive ? undefined : (e) => onRowClick?.(row, e)}
                      {...getCommonPinningProps(cell.column)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
            {children}
          </>
        ) : (
          <TableEmptyState
            containerRef={containerRef as any}
            colSpan={table.getAllLeafColumns().length}
          >
            <div className="h-24 flex flex-col justify-center text-center">ไม่มีข้อมูล</div>
          </TableEmptyState>
        )}
      </TableBody>
      {footer ?? null}
      <PinnedShadow table={table} position="left" isFloating={!scrolledToStart} />
      <PinnedShadow table={table} position="right" isFloating={!scrolledToEnd} />
    </Table>
  )
}

function TableEmptyState({
  containerRef,
  colSpan,
  children,
}: {
  containerRef: RefObject<HTMLElement>
  colSpan: number
  children: ReactNode
}) {
  return (
    <TableRow className="relative bg-surface hover:bg-surface z-[1]" ref={containerRef as any}>
      <TableCell colSpan={colSpan} className="text-center py-10">
        Empty
      </TableCell>
    </TableRow>
  )
}

export function getCommonPinningProps(column: Column<any>) {
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

function PinnedShadow({
  position,
  table,
  isFloating,
}: {
  position: 'left' | 'right'
  table: TanstackTable<any>
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
        className={twMerge(
          'sticky block h-full bg-border-outline transition-shadow shadow-none data-[floating=true]:shadow-[0px_10px_20px_0px_#00000033]',
          position === 'left' ? 'left-0' : 'right-0'
        )}
        data-floating={isFloating}
        style={{ width: `${width}px` }}
      />
    </tbody>
  )
}
