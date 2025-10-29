'use client'

import * as React from 'react'

import { CheckIcon, type Icon } from '@phosphor-icons/react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../../src/react/utils/cn'

type Variants = {
  variant: Record<'default' | 'incorrect' | 'correct', any>
  shape: Record<'square' | 'rounded', any>
}

const checkbox = cva<Variants>(
  [
    'peer ring-offset-2  focus-visible:border-ring focus-visible:ring-ring size-8 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[2px]',
    'disabled:cursor-not-allowed data-[state=checked]:disabled:border-border disabled:bg-surface-tertiary data-[state=checked]:disabled:bg-surface-tertiary data-[state=checked]:disabled:text-icon-disabled',
    'aria-invalid:ring-destructive dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[state=checked]:aria-invalid:border-destructive',
  ],
  {
    variants: {
      variant: {
        default:
          'border-input data-[state=checked]:border-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:data-[state=checked]:bg-primary',
        incorrect:
          'border-input data-[state=checked]:border-none data-[state=checked]:bg-icon-incorrect data-[state=checked]:text-text-inverse',
        correct:
          'border-input data-[state=checked]:border-none data-[state=checked]:bg-icon-correct data-[state=checked]:text-text-inverse',
      },
      shape: {
        square: '',
        rounded: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      shape: 'square',
    },
  }
)

const checkboxIndicator = cva<Variants>('', {
  variants: {
    variant: { default: null, incorrect: null, correct: null },
    shape: { square: 'size-7', rounded: 'size-6' },
  },
  defaultVariants: {
    shape: 'square',
  },
})

interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkbox> {
  icon?: Icon
}

function Checkbox({ className, variant, shape, icon: Icon = CheckIcon, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkbox({ variant, shape }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <Icon className={cn(checkboxIndicator({ shape, variant }))} weight="bold" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, type CheckboxProps }
