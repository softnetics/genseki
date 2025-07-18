'use client'

import { createContext, forwardRef, use } from 'react'
import {
  type CellProps,
  type ColumnProps,
  type ColumnResizerProps,
  composeRenderProps,
  type RowProps,
  type TableBodyProps,
  type TableHeaderProps as HeaderProps,
  type TableProps as TablePrimitiveProps,
} from 'react-aria-components'
import {
  Button,
  Cell,
  Collection,
  Column,
  ColumnResizer as ColumnResizerPrimitive,
  ResizableTableContainer,
  Row,
  Table as TablePrimitive,
  TableBody as TableBodyPrimitive,
  TableHeader as TableHeaderPrimitive,
  useTableOptions,
} from 'react-aria-components'

import { IconChevronLgDown, IconHamburger } from '@intentui/icons'
import { twJoin, twMerge } from 'tailwind-merge'

import { Checkbox } from './checkbox'
import { composeTailwindRenderProps } from './primitive'

interface TableProps extends Omit<TablePrimitiveProps, 'className'> {
  allowResize?: boolean
  className?: string
  bleed?: boolean
  ref?: React.Ref<HTMLTableElement>
}

const TableContext = createContext<TableProps>({
  allowResize: false,
})

const useTableContext = () => use(TableContext)

const Root = forwardRef<HTMLTableElement, TableProps>((props, ref) => {
  return (
    <TablePrimitive
      // TODO: Fix type error with ref
      ref={ref as any}
      className="outline-hidden [--table-selected-bg:var(--color-secondary)]/50 w-full min-w-full caption-bottom text-sm"
      {...props}
    />
  )
})

const Table = ({ allowResize, className, bleed, ref, ...props }: TableProps) => {
  return (
    <TableContext.Provider value={{ allowResize, bleed }}>
      <div className="flow-root rounded-sm overflow-hidden border border-border shadow-xs">
        <div
          className={twMerge(
            '-mx-(--gutter) has-data-[slot=table-resizable-container]:overflow-auto relative overflow-x-auto whitespace-nowrap',
            '[--gutter-y:--spacing(6)] [--gutter:--spacing(6)]',
            className
          )}
        >
          <div
            className={twJoin('inline-block min-w-full align-middle', !bleed && 'sm:px-(--gutter)')}
          >
            {allowResize ? (
              <ResizableTableContainer data-slot="table-resizable-container">
                {/* TODO: Fix ref as any */}
                <Root ref={ref as any} {...props} />
              </ResizableTableContainer>
            ) : (
              <Root {...props} ref={ref as any} />
            )}
          </div>
        </div>
      </div>
    </TableContext.Provider>
  )
}

const ColumnResizer = ({ className, ...props }: ColumnResizerProps) => (
  <ColumnResizerPrimitive
    {...props}
    className={composeTailwindRenderProps(
      className,
      '&[data-resizable-direction=left]:cursor-e-resize &[data-resizable-direction=right]:cursor-w-resize [&[data-resizing]>div]:bg-primary absolute bottom-0 right-0 top-0 grid w-px touch-none place-content-center px-1 data-[resizable-direction=both]:cursor-ew-resize'
    )}
  >
    <div className="bg-border py-(--gutter-y) h-full w-px" />
  </ColumnResizerPrimitive>
)

const TableBody = <T extends object>(props: TableBodyProps<T>) => (
  <TableBodyPrimitive data-slot="table-body" {...props} />
)

interface TableColumnProps extends ColumnProps {
  className?: string
  isResizable?: boolean
}

const TableColumn = ({ isResizable = false, className, ...props }: TableColumnProps) => {
  const { bleed } = useTableContext()
  return (
    <Column
      data-slot="table-column"
      {...props}
      className={composeTailwindRenderProps(
        className,
        twJoin(
          'text-bluegray-400 text-left font-semibold text-sm',
          'allows-sorting:cursor-default outline-hidden data-dragging:cursor-grabbing relative',
          'px-6 py-7',
          // !bleed
          //   ? 'sm:first:pl-1 sm:last:pr-1'
          //   : 'first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))',
          isResizable && 'overflow-hidden truncate'
        )
      )}
    >
      {(values) => (
        <div className="**:data-[slot=icon]:shrink-0 flex items-center gap-2">
          <>
            {typeof props.children === 'function' ? props.children(values) : props.children}
            {values.allowsSorting && (
              <span
                className={twMerge(
                  'bg-secondary text-fg grid size-[1.15rem] flex-none shrink-0 place-content-center rounded *:data-[slot=icon]:size-3.5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:transition-transform *:data-[slot=icon]:duration-200',
                  values.isHovered ? 'bg-secondary-fg/10' : '',
                  className
                )}
              >
                <IconChevronLgDown
                  className={values.sortDirection === 'ascending' ? 'rotate-180' : ''}
                />
              </span>
            )}
            {isResizable && <ColumnResizer />}
          </>
        </div>
      )}
    </Column>
  )
}

interface TableHeaderProps<T extends object> extends HeaderProps<T> {
  ref?: React.Ref<HTMLTableSectionElement>
}

const TableHeader = <T extends object>({
  children,
  ref,
  columns,
  className,
  ...props
}: TableHeaderProps<T>) => {
  const { bleed } = useTableContext()
  const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions()
  return (
    <TableHeaderPrimitive
      data-slot="table-header"
      className={composeTailwindRenderProps(className, 'border-border bg-muted border-b')}
      // TODO: Fix type error with ref
      ref={ref as any}
      {...props}
    >
      {allowsDragging && (
        <Column
          data-slot="table-column"
          className={twMerge(
            'px-(--gutter) w-0 max-w-8',
            !bleed
              ? 'sm:first:pl-1 sm:last:pr-1'
              : 'first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))'
          )}
        />
      )}
      {selectionBehavior === 'toggle' && (
        <Column
          data-slot="table-column"
          className={twMerge(
            'px-(--gutter) w-0 max-w-8',
            !bleed
              ? 'sm:first:pl-1 sm:last:pr-1'
              : 'first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))'
          )}
        >
          {selectionMode === 'multiple' && <Checkbox slot="selection" />}
        </Column>
      )}
      <Collection items={columns}>{children}</Collection>
    </TableHeaderPrimitive>
  )
}

interface TableRowProps<T extends object> extends RowProps<T> {
  ref?: React.Ref<HTMLTableRowElement>
}

const TableRow = <T extends object>({
  children,
  className,
  columns,
  id,
  ref,
  ...props
}: TableRowProps<T>) => {
  const { selectionBehavior, allowsDragging } = useTableOptions()
  return (
    <Row
      // TODO: Fix type error with ref
      ref={ref as any}
      data-slot="table-row"
      id={id}
      {...props}
      className={composeRenderProps(
        className,
        (className, { isSelected, selectionMode, isFocusVisibleWithin, isDragging, isDisabled }) =>
          twMerge(
            'text-muted-fg ring-primary border-muted group relative cursor-default border-b outline-transparent last:border-b-0',
            isDragging && 'outline outline-blue-500',
            isSelected && 'bg-(--table-selected-bg) text-fg hover:bg-(--table-selected-bg)/50',
            (props.href || props.onAction || selectionMode === 'multiple') &&
              'hover:bg-(--table-selected-bg) hover:text-fg',
            (props.href || props.onAction || selectionMode === 'multiple') &&
              isFocusVisibleWithin &&
              'bg-(--table-selected-bg)/50 selected:bg-(--table-selected-bg)/50 text-fg',
            isDisabled && 'opacity-50',
            className
          )
      )}
    >
      {allowsDragging && (
        <TableCell className="dragging:cursor-grabbing ring-primary cursor-grab">
          <Button
            slot="drag"
            className="rounded-xs outline-hidden focus-visible:ring-ring grid place-content-center px-[calc(var(--gutter)/2)] focus-visible:ring"
          >
            <IconHamburger />
          </Button>
        </TableCell>
      )}
      {selectionBehavior === 'toggle' && (
        <TableCell>
          <Checkbox slot="selection" />
        </TableCell>
      )}
      <Collection items={columns}>{children}</Collection>
    </Row>
  )
}

const TableCell = ({ className, ...props }: CellProps) => {
  const { allowResize, bleed } = useTableContext()
  return (
    <Cell
      data-slot="table-cell"
      {...props}
      className={composeTailwindRenderProps(
        className,
        twJoin(
          'px-6 py-10 outline-hidden group-has-data-focus-visible-within:text-fg group align-middle text-base text-fg bg-white dark:bg-transparent',
          // !bleed
          //   ? 'sm:first:pl-1 sm:last:pr-1'
          //   : 'first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))',
          allowResize && 'overflow-hidden truncate'
        )
      )}
    />
  )
}

export type { TableColumnProps, TableProps, TableRowProps }
export { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow }
