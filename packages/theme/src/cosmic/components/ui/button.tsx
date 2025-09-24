'use client'

import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'cursor-pointer flex items-center justify-center transition-all duration-200',
  {
    variants: {
      variant: {
        primary: `[&>*]:text-white text-white
          shadow-[0_0_0_0.8px_var(--color-primary-emphasis),0_1px_3px_0_var(--color-primary),inset_0_1.5px_0_0_--alpha(var(--color-white)/20%)]
          focus-visible:ring-2 focus-visible:ring-primary-emphasis focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none`,
        secondary: `
          bg-pumpkin-50 hover:bg-pumpkin-100
          [&>*]:text-accent text-accent
          focus-visible:ring-2 focus-visible:ring-primary-emphasis focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none`,
        tertiary: `bg-pumpkin-50 hover:bg-pumpkin-100
          [&>*]:text-accent text-accent 
          focus-visible:ring-2 focus-visible:ring-primary-emphasis focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none border border-primary-emphasis`,
        naked: `bg-white-normal hover:bg-bluegray-100 [&>*]:text-bluegray-600 text-bluegray-600 shadow-xs border-b border-stroke-trivial/10 
        focus-visible:ring-2 focus-visible:ring-primary-emphasis focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none`,
        outline: `bg-white-normal dark:bg-bluegray-800 hover:bg-bluegray-50 [&>*]:text-text-body text-text-body border border-bluegray-300 focus-visible:ring-2 focus-visible:ring-primary-emphasis focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none`,
        ghost:
          'bg-none [&>*]:text-bluegray-600 text-bluegray-600 hover:bg-bluegray-50 focus-visible:ring-2 focus-visible:ring-primary-emphasis focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none',
        vanish:
          '[&>*]:text-secondary-fg text-secondary-fg focus-visible:ring-2 focus-visible:ring-primary-emphasis focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none',
        destruction: `[&>*]:text-white text-white bg-red-600 hover:bg-red-700
          focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none`,
      },
      size: {
        md: 'p-6 gap-x-2 rounded-md text-base font-medium',
        sm: 'p-4 gap-x-2 rounded-md text-sm font-medium',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
