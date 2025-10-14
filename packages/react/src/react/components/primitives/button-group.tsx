'use client'

import { createContext, use } from 'react'
import {
  composeRenderProps,
  ToggleButton,
  ToggleButtonGroup,
  type ToggleButtonGroupProps,
  type ToggleButtonProps,
} from 'react-aria-components'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import { composeTailwindRenderProps } from './primitive'
import { Separator } from './separator'

import { cn } from '../../utils/cn'

/**
 * React Aria component
 */

/**
 * @deprecated
 */

type AriaButtonSize = 'sm' | 'md'

/**
 * @deprecated
 */
interface AriaButtonGroupContextValue
  extends Pick<ToggleButtonGroupProps, 'selectionMode' | 'orientation'> {
  size?: AriaButtonSize
}

/**
 * @deprecated
 */
const AriaButtonGroupContext = createContext<AriaButtonGroupContextValue>({
  size: 'md',
  selectionMode: 'single',
  orientation: 'horizontal',
})

/**
 * @deprecated
 */
const useAriaButtonGroupContext = () => use(AriaButtonGroupContext)

/**
 * @deprecated
 */
interface AriaButtonGroupProps extends ToggleButtonGroupProps {
  size?: AriaButtonSize
}

/**
 * @deprecated
 */
const AriaButtonGroup = ({
  size = 'md',
  orientation = 'horizontal',
  selectionMode = 'single',
  className,
  ...props
}: AriaButtonGroupProps) => {
  return (
    <AriaButtonGroupContext.Provider value={{ size, selectionMode, orientation }}>
      <ToggleButtonGroup
        selectionMode={selectionMode}
        className={composeTailwindRenderProps(
          className,
          `inset-ring inset-ring-border inline-flex overflow-hidden rounded-md border-bluegray-300 p-0.5 ${
            orientation === 'horizontal' ? 'flex-row' : 'flex-col'
          } ${selectionMode === 'single' ? 'gap-0.5' : 'gap-0'}`
        )}
        {...props}
      />
    </AriaButtonGroupContext.Provider>
  )
}

/**
 * @deprecated
 */
interface AriaButtonGroupItemProps extends ToggleButtonProps {}

/**
 * @deprecated
 */
const AriaButtonGroupItemStyles = tv({
  base: [
    'bg-surface-primary-hover cursor-pointer dark:bg-bluegray-700',
    'text-bluegray-800 px-4 py-2 dark:text-bluegray-200',
    'relative isolate inline-flex flex-row items-center font-medium outline-hidden',
  ],
  variants: {
    orientation: {
      horizontal: 'justify-center',
      vertical: 'justify-start',
    },
    selectionMode: {
      single: '',
      multiple:
        'rounded-none first:rounded-l-[calc(var(--radius-lg)-2px)] last:rounded-r-[calc(var(--radius-lg)-2px)]',
    },
    size: {
      sm: [
        'text-sm',
        '*:data-[slot=icon]:size-4.5 sm:*:data-[slot=icon]:size-4',
        '*:data-[slot=loader]:size-4.5 sm:*:data-[slot=loader]:size-4',
      ],
      md: [
        'text-base',
        '*:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:size-4',
        '*:data-[slot=loader]:size-5 sm:*:data-[slot=loader]:size-4',
      ],
    },
    isSelected: {
      // add inside shadow
      true: `bg-white dark:bg-bluegray-800`,
    },
    isDisabled: {
      true: 'opacity-50 grayscale cursor-not-allowed',
    },
  },
  defaultVariants: {
    size: 'md',
    isCircle: false,
  },
})

/**
 * @deprecated
 */
const AriaButtonGroupItem = ({ className, ...props }: AriaButtonGroupItemProps) => {
  const { size, selectionMode, orientation } = useAriaButtonGroupContext()

  return (
    <ToggleButton
      data-slot="toggle-group-item"
      className={composeRenderProps(className, (className, renderProps) =>
        twMerge(
          AriaButtonGroupItemStyles({
            ...renderProps,
            size,
            orientation,
            selectionMode,
            className,
          })
        )
      )}
      {...props}
    />
  )
}

export type { AriaButtonGroupItemProps, AriaButtonGroupProps }
export { AriaButtonGroup, AriaButtonGroupItem }

/**
 * Shadcn component
 */

const buttonGroupVariants = cva(
  "flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-4",
  {
    variants: {
      orientation: {
        horizontal:
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      className={cn(
        "bg-muted flex items-center gap-4 rounded-md border px-8 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-8",
        className
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        'bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto',
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants }
