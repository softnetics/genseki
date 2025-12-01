'use client'
import * as React from 'react'

import { ArrowLeftIcon, ArrowRightIcon, DotsThreeIcon } from '@phosphor-icons/react'
import { Slot } from '@radix-ui/react-slot'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import type { VariantProps } from 'class-variance-authority'

import { buttonVariants } from './button'
import { ButtonGroup, buttonGroupVariants } from './button-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from './select'
import { Typography } from './typography'

import { cn } from '../../utils/cn'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={className}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<typeof ButtonGroup>) {
  return (
    <ButtonGroup
      data-slot="pagination-content"
      className={buttonGroupVariants({ orientation: 'horizontal', className })}
      {...props}
    />
  )
}

interface PaginationItemProps
  extends React.ComponentProps<typeof Slot>,
    VariantProps<typeof buttonVariants> {
  isActive?: boolean
  disabled?: boolean
}

function PaginationItem({
  className,
  variant = 'outline',
  size = 'icon',
  isActive,
  ...props
}: PaginationItemProps) {
  return (
    <Slot
      {...props}
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        isActive && 'bg-surface-button-outline-hover',
        className
      )}
      data-slot="pagination-item"
      aria-current={isActive ? 'page' : undefined}
      data-active={isActive}
    />
  )
}

type PaginationLinkProps = React.ComponentProps<'a'>

function PaginationLink({ asChild, ...props }: { asChild?: boolean } & PaginationLinkProps) {
  const Comp = asChild ? Slot : 'a'

  return <Comp data-slot="pagination-link" {...props} />
}

function PaginationPrevious(props: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink asChild aria-label="Go to previous page" {...props}>
      <button>
        <ArrowLeftIcon />
      </button>
    </PaginationLink>
  )
}

function PaginationNext(props: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink asChild aria-label="Go to next page" {...props}>
      <button>
        <ArrowRightIcon />
      </button>
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      {...props}
      className={cn('flex size-18 items-center justify-center', className)}
      aria-hidden
      data-slot="pagination-ellipsis"
    >
      <DotsThreeIcon className="size-8" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

type PageSizeSelectProps = Omit<
  React.ComponentPropsWithRef<typeof Select>,
  'value' | 'onValueChange'
> & {
  value?: number
  onValueChange?: React.Dispatch<number>
  options?: number[]
  className?: string
}

function PageSizeSelect({ className, options, ...props }: PageSizeSelectProps) {
  const pageSizeOptions = options ?? [10, 20, 50, 100]

  const [value, setValue] = useControllableState({
    defaultProp: 10,
    prop: props.value,
    onChange: props.onValueChange,
  })

  return (
    <div className="flex items-center gap-6">
      <Select {...props} value={value.toString()} onValueChange={(value) => setValue(~~value)}>
        <SelectTrigger className={cn('text-text-primary w-72', className)}>
          <div>
            {props.children}
            <SelectValue aria-label="Show" placeholder="Show" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {pageSizeOptions.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              <SelectItemText>{option}</SelectItemText>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface PageIndexProps extends React.ComponentPropsWithRef<'div'> {
  page: number
  totalPage: number
}

function PageIndex({ page, totalPage, ...props }: PageIndexProps) {
  return (
    <div {...props}>
      <Typography className="text-text-tertiary whitespace-pre-wrap">Page </Typography>
      <Typography weight="semibold" className="text-text-primary whitespace-pre-wrap">
        {page}{' '}
      </Typography>
      <Typography className="text-text-tertiary whitespace-pre-wrap">of </Typography>
      <Typography weight="semibold" className="text-text-primary">
        {totalPage}
      </Typography>
    </div>
  )
}

function PaginationBarContainer({ children, ...props }: React.ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn('p-6 flex justify-between bg-background border-t border-border', children)}
      {...props}
    />
  )
}

export {
  PageIndex,
  type PageIndexProps,
  PageSizeSelect,
  type PageSizeSelectProps,
  Pagination,
  PaginationBarContainer,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
