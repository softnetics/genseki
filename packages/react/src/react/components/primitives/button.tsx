import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-8 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    'disabled:opacity-80 cursor-pointer',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 active:bg-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline hover:border-0',
      },
      isPending: {
        true: '',
        false: '',
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
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  isPending = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      disabled={isPending || props.disabled}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className, isPending }))}
      {...props}
    />
  )
}

function ButtonLink({
  className,
  variant,
  size,
  asChild = false,
  isPending = false,
  href,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    href: string
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      disabled={isPending || props.disabled}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className, isPending }))}
      {...props}
      onClick={() => {
        window.location.href = href
      }}
    />
  )
}

export { Button, ButtonLink, buttonVariants }
