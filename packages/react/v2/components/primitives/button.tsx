'use client'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../../src/react/utils/cn'
/**
 *
 * Shadcn component
 *
 */

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-8 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring ring-offset-1 focus-visible:ring-ring/50 focus-visible:ring-[2px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    'disabled:opacity-80 cursor-pointer',
  ],
  {
    variants: {
      variant: {
        primary:
          ' bg-surface-button-primary text-text-inverse hover:bg-surface-button-primary-hover active:bg-surface-button-primary disabled:bg-surface-button-primary-disabled disabled:text-text-disabled disabled:border disabled:border-border-button-primary-disabled',
        secondary:
          ' bg-surface-button-secondary text-text-brand hover:bg-surface-button-secondary-hover active:bg-surface-button-secondary disabled:bg-surface-button-secondary-disabled disabled:text-text-disabled',
        tertiary:
          ' bg-surface-button-tertiary border border-border-button-tertiary text-text-brand hover:bg-surface-button-tertiary-hover active:bg-surface-button-tertiary hover:border-border-button-tertiary-hover disabled:bg-surface-button-tertiary-disabled disabled:border-border-button-tertiary-disabled disabled:text-text-disabled',
        naked:
          'shadow-sm ring-offset-0 text-text-secondary hover:bg-surface-button-naked-hover active:bg-transparent disabled:bg-surface-button-naked-disabled  disabled:text-text-disabled',
        outline:
          ' border border-border-button-outline text-text-secondary bg-surface-button-outline shadow-xs hover:bg-surface-button-outline-hover active:bg-surface-button-outline hover:border-border-button-outline-hover disabled:bg-surface-button-outline-disabled disabled:text-text-disabled disabled:border disabled:border-border-button-outline-disabled dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        ghost:
          ' bg-surface-button-ghost hover:bg-surface-button-ghost-hover active:bg-surface-button-ghost text-text-secondary hover:text-accent-foreground dark:hover:bg-accent/50',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 active:bg-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
      },
      size: {
        default: 'h-18 px-8 py-4 has-[>svg]:px-6',
        sm: 'h-16 rounded-md gap-3 px-6 has-[>svg]:px-5',
        lg: 'h-20 rounded-md px-12 has-[>svg]:px-8',
        icon: 'size-18',
        'icon-sm': 'size-16',
        'icon-lg': 'size-20',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
