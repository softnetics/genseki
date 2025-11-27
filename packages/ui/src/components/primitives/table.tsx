import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

interface TableContainerProps
  extends React.ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof tanstackTableContainerStyle> {}

export const tanstackTableContainerStyle = cva('w-full overflow-auto', {
  variants: {
    variant: {
      default: 'rounded-sm border border-border',
      naked: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export const TanstackTableContainer = React.forwardRef<HTMLDivElement, TableContainerProps>(
  ({ variant, className, ...props }, ref) => {
    return (
      <div ref={ref} className={tanstackTableContainerStyle({ variant, className })} {...props} />
    )
  }
)

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <table ref={ref} className={cn('relative w-full caption-bottom', className)} {...props} />
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('text-foreground px-6 py-7 text-left border-border border-b text-sm', className)}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('text-text-primary font-medium text-base', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('font-normal text-base text-text-primary', className)}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'transition-colors',
        props.datatype === 'selected' && 'bg-bluegray-50',
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : 'th'
  return (
    <Comp
      ref={ref}
      className={cn(
        'text-foreground px-6 py-7 text-left align-middle font-semibold bg-muted',
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
    className={cn(
      'bg-background text-foreground px-6 py-7 text-left align-middle whitespace-nowrap text-primary-s font-normal',
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
  <caption ref={ref} className={cn('mt-4', className)} {...props} />
))
TableCaption.displayName = 'TableCaption'

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
