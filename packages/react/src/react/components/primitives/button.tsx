'use client'
import * as React from 'react'
import type { LinkProps as LinkPrimitiveProps } from 'react-aria-components'
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  Link,
} from 'react-aria-components'

import { Spinner, SpinnerIcon } from '@phosphor-icons/react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { tv, type VariantProps as TwVariantProps } from 'tailwind-variants'

import { BaseIcon } from './base-icon'

import { cn } from '../../utils/cn'

/**
 *
 * React Aria component
 *
 */

/**
 * @deprecated
 */
const ariaButtonVariants = tv({
  base: 'cursor-pointer flex items-center justify-center transition-all duration-200',
  variants: {
    variant: {
      primary: `[&>*]:text-text-inverse text-text-inverse
        focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none`,
      secondary: `
        bg-surface-button-secondary hover:bg-surface-button-secondary-hover disabled:bg-surface-button-secondary-disabled
        [&>*]:text-text-brand text-text-brand
        focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none`,
      tertiary: `bg-surface-button-tertiary hover:bg-surface-button-tertiary-hover disabled:bg-surface-button-tertiary-disabled focus:outline-none
        [&>*]:text-text-brand text-text-brand 
        focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg border border-border-button-tertiary`,
      naked: `bg-surface-button-naked hover:bg-surface-button-naked-hover disabled:bg-surface-button-naked-disabled focus:outline-none
       [&>*]:text-text-secondary text-text-secondary shadow-xs border-b border-stroke-tertiary/10 
      focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg`,
      outline: `bg-surface-button-outline  hover:bg-surface-button-outline-hover disabled:bg-surface-button-outline-disabled focus:outline-none
       [&>*]:text-text-secondary text-text-secondary border border-border-button-outline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg`,
      ghost:
        'bg-none [&>*]:text-text-secondary text-text-secondary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none',
      vanish:
        '[&>*]:text-secondary-fg text-secondary-fg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none',
      destruction: `[&>*]:text-text-inverse text-text-inverse bg-surface-button-destruction hover:bg-surface-button-destruction-hover disabled:bg-surface-button-destruction-disabled focus:outline-none
        focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg `,
    },
    size: {
      'square-petite': 'size-14 p-0 rounded-md text-base font-medium',
      md: 'py-4 [&:has(>_*[data-slot="icon"]:only-child)]:p-4 px-6 gap-x-2 rounded-md text-base font-medium',
      sm: 'py-3 [&:has(>_*[data-slot="icon"]:only-child)]:p-3 px-4 gap-x-2 rounded-md text-sm font-medium',
      xs: 'py-1 [&:has(>_*[data-slot="icon"]:only-child)]:p-1 px-2 gap-x-1 rounded-sm text-sm font-medium',
    },
    isDisabled: {
      true: 'cursor-not-allowed [&>*]:text-bluegray-300 text-bluegray-300 border-secondary shadow-none',
      false: null,
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      isDisabled: false,
      className: 'brand-primary-gradient-25% hover:brand-primary-gradient-0%',
    },
    {
      variant: 'secondary',
      isDisabled: false,
      className: 'brand-secondary-gradient-10% hover:brand-secondary-gradient-0%',
    },
    {
      variant: 'tertiary',
      isDisabled: false,
      className: 'brand-secondary-gradient-10% hover:brand-secondary-gradient-0% ',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    isDisabled: false,
  },
})

/**
 * @deprecated
 */
type AriaButtonVariants = TwVariantProps<typeof ariaButtonVariants>

/**
 * @deprecated
 */
interface AriaButtonProps
  extends ButtonPrimitiveProps,
    Required<Omit<AriaButtonVariants, 'isDisabled'>>,
    Pick<AriaButtonVariants, 'isDisabled'> {
  leadingIcon?: React.ReactElement
  trailingIcon?: React.ReactElement
}

/**
 * @deprecated
 */
const AriaButton = React.forwardRef<HTMLButtonElement, AriaButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const { isDisabled, isPending = false } = props

    return (
      <ButtonPrimitive
        data-xxx="xxx"
        ref={ref}
        {...props}
        isDisabled={isDisabled || isPending}
        className={(value) =>
          cn(
            ariaButtonVariants({
              variant,
              size,
              isDisabled,
              className: typeof className === 'function' ? className(value) : className,
            })
          )
        }
      >
        {(values) => (
          <>
            {props.leadingIcon}
            {typeof props.children === 'function' ? props.children(values) : props.children}
            {isPending ? (
              <BaseIcon icon={SpinnerIcon} size="sm" className="animate-spin" />
            ) : (
              props.trailingIcon
            )}
          </>
        )}
      </ButtonPrimitive>
    )
  }
)

/**
 * @deprecated
 */
interface AriaButtonLinkProps
  extends LinkPrimitiveProps,
    Required<Omit<AriaButtonVariants, 'isDisabled'>>,
    Pick<AriaButtonVariants, 'isDisabled'> {
  leadingIcon?: React.ReactElement
  trailingIcon?: React.ReactElement
  isPending?: boolean
}

/**
 * @deprecated
 */
const AriaButtonLink = React.forwardRef<HTMLAnchorElement, AriaButtonLinkProps>(function ButtonLink(
  { className, variant, size, isDisabled = false, isPending = false, children, ...props },
  ref
) {
  return (
    <Link
      ref={ref}
      data-slot="button"
      isDisabled={isDisabled || isPending}
      className={(value) =>
        cn(
          ariaButtonVariants({
            variant,
            size,
            isDisabled,
            className: typeof className === 'function' ? className(value) : className,
          })
        )
      }
      {...props}
    >
      {(values) => (
        <>
          {props.leadingIcon}
          {typeof children === 'function' ? children(values) : children}
          {isPending ? (
            <BaseIcon icon={Spinner} size="sm" className="animate-spin" />
          ) : (
            props.trailingIcon
          )}
        </>
      )}
    </Link>
  )
})

export { AriaButton, AriaButtonLink, type AriaButtonLinkProps, type AriaButtonProps }

/**
 *
 * Shadcn component
 *
 */

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

function ButtonLink({
  className,
  variant,
  size,
  asChild = false,
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
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      onClick={() => {
        window.location.href = href
      }}
    />
  )
}

export { Button, ButtonLink, buttonVariants }
