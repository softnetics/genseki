'use client'

import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { Button } from './button'
import type { Input } from './input'

import { createRequiredContext } from '../../hooks/create-required-context'
import { cn } from '../../utils/cn'

const [InputGroupProvider, useInputGroup] = createRequiredContext<{
  isPending?: boolean
  disabled?: boolean
}>('Input group context')

function InputGroup({
  className,
  isPending,
  disabled,
  ...props
}: React.ComponentProps<'div'> & { isPending?: boolean; disabled?: boolean }) {
  return (
    <InputGroupProvider isPending={isPending} disabled={disabled}>
      <div
        data-slot="input-group"
        data-pending={isPending}
        data-disabled={disabled}
        role="group"
        className={cn(
          'group/input-group data-disabled:bg-surface-primary-disabled data-disabled:border-border-primary bg-background border-input dark:bg-input/30 relative flex items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none',
          'h-auto min-w-0 has-[>textarea]:h-auto',

          // Variants based on alignment.
          'has-[>[data-align=inline-start]]:[&>input]:pl-4',
          'has-[>[data-align=inline-end]]:[&>input]:pr-4',
          'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-6',
          'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-6',

          // Focus state.
          'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot=input-group-control]:focus-visible]:ring-[2px]',

          // Error state.
          'has-[[data-slot][aria-invalid=true]]:ring-destructive has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive',

          // Custom
          isPending && 'bg-muted pointer-events-none animate-pulse',

          className
        )}
        {...props}
      />
    </InputGroupProvider>
  )
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-4 py-3 text-sm font-medium select-none [&>svg:not([class*='size-'])]:size-8 [&>kbd]:rounded-[calc(var(--radius)-5px)] group-data-[disabled=true]/input-group:opacity-80",
  {
    variants: {
      align: {
        'inline-start': 'order-first pl-6 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]',
        'inline-end': 'order-last pr-6 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]',
        'block-start':
          'order-first w-full justify-start px-6 pt-6 [.border-b]:pb-6 group-has-[>input]/input-group:pt-5',
        'block-end':
          'order-last w-full justify-start px-6 pb-6 [.border-t]:pt-6 group-has-[>input]/input-group:pb-5',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  }
)

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  [
    'text-sm shadow-none flex gap-2 items-center ring-offset-0',
    'group-data-[disabled=true]/input-group:pointer-events-none',
  ],
  {
    variants: {
      size: {
        xs: "h-12 gap-2 px-4 rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-7 has-[>svg]:px-4",
        sm: 'h-16 px-5 gap-3 rounded-md has-[>svg]:px-5',
        'icon-xs': 'size-12 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0',
        'icon-sm': 'size-16 p-0 has-[>svg]:p-0',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  }
)

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size'> &
  VariantProps<typeof inputGroupButtonVariants>) {
  const ctx = useInputGroup()
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      disabled={ctx.disabled}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        "text-muted-foreground group-data-[disabled=true]/input-group:text-text-disabled flex items-center gap-4 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-8",
        className
      )}
      {...props}
    />
  )
}

function InputGroupControl({ className, disabled, ...props }: React.ComponentProps<typeof Input>) {
  const ctx = useInputGroup()

  const isDisabled = ctx.disabled || disabled

  return (
    <Slot
      data-slot="input-group-control"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={cn(
        'flex-2 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent',
        className
      )}
      {...(props as any)}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupControl, InputGroupText }
