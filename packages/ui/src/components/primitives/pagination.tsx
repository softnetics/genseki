'use client'
import * as React from 'react'

import { ArrowLeftIcon, ArrowRightIcon, DotsThreeIcon } from '@phosphor-icons/react'
import { Slot } from '@radix-ui/react-slot'
import { useControllableState } from '@radix-ui/react-use-controllable-state'

import { type Button, buttonVariants } from './button'
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

function PaginationItem({ ...props }: React.ComponentProps<typeof Slot>) {
  return <Slot data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size' | 'disabled'> &
  React.ComponentProps<'a'>

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  asChild,
  ...props
}: { asChild?: boolean } & PaginationLinkProps) {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: 'outline',
          size,
        }),
        isActive && 'bg-surface-button-outline-hover',
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      asChild
      aria-label="Go to previous page"
      size="md"
      className={cn(
        // Strict width since sizing does not enforce the width
        'w-18',
        {
          'w-16': props.size === 'sm',
          'w-20': props.size === 'lg',
        },
        className
      )}
      {...props}
    >
      <button>
        <ArrowLeftIcon />
      </button>
    </PaginationLink>
  )
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      asChild
      aria-label="Go to next page"
      size="md"
      className={cn(
        // Strict width since sizing does not enforce the width
        'w-18',
        {
          'w-16': props.size === 'sm',
          'w-20': props.size === 'lg',
        },
        className
      )}
      {...props}
    >
      <button>
        <ArrowRightIcon />
      </button>
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-18 items-center justify-center', className)}
      {...props}
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

function PaginationBarContainer(props: React.PropsWithChildren) {
  return (
    <div className="p-6 flex justify-between bg-background border-t border-border">
      {props.children}
    </div>
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
