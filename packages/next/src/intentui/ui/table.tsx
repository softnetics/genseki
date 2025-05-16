import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { twMerge } from 'tailwind-merge'

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  containerRef?: React.Ref<HTMLDivElement>
  containerClassName?: string
  containerStyle?: React.CSSProperties
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerRef, containerClassName, containerStyle, ...props }, ref) => (
    <div
      ref={containerRef}
      className={twMerge(
        'w-full overflow-auto border border-border-outline rounded-lg',
        containerClassName
      )}
      style={containerStyle}
    >
      <table
        ref={ref}
        className={twMerge(
          'relative w-full caption-bottom bg-surface [&_th]:border-border-outline [&_td]:border-border-outline',
          className
        )}
        {...props}
      />
    </div>
  )
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={twMerge(
      '[&_th:not(:first-child)]:border-l [&_th]:border-b bg-surface-container',
      className
    )}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={twMerge('[&_td:not(:first-child)]:border-l', className)} {...props} />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={twMerge('bg-primary font-medium text-primary-foreground', className)}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { horizontalBorders?: boolean }
>(({ className, horizontalBorders = false, ...props }, ref) => (
  <tr
    ref={ref}
    className={twMerge(
      'transition-colors text-body-large text-text-on-surface-variant hover:bg-surface-container data-[state=selected]:bg-surface-primary-container',
      horizontalBorders && '[&:not(:last-child)]:border-b border-border-outline',
      className
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : 'th'
  return (
    <Comp
      ref={ref}
      className={twMerge(
        'px-2 py-4 text-left align-middle text-body-large-prominent text-text-on-surface',
        className
      )}
      {...props}
    />
  )
})
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={twMerge(
      'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={twMerge('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
