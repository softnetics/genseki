'use client'
import React, { forwardRef } from 'react'
import type { LinkProps as LinkPrimitiveProps } from 'react-aria-components'
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  Link,
} from 'react-aria-components'

import { Spinner } from '@phosphor-icons/react'
import { tv, type VariantProps } from 'tailwind-variants'

import { BaseIcon } from './base-icon'

import { cn } from '../../utils/cn'

const buttonVariants = tv({
  base: 'cursor-pointer flex items-center justify-center transition-all duration-200',
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
      'square-petite': 'size-14 p-0 rounded-md text-base font-medium',
      md: 'p-6 gap-x-2 rounded-md text-base font-medium',
      sm: 'p-4 gap-x-2 rounded-md text-sm font-medium',
      xs: 'p-2 gap-x-1 rounded-sm text-sm font-medium',
      xxs: 'p-1 gap-x-1 rounded-xs text-xs font-medium',
    },
    isDisabled: {
      true: 'cursor-not-allowed bg-accent-fg [&>*]:text-bluegray-300 text-bluegray-300 border-secondary shadow-none',
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

type ButtonVariants = VariantProps<typeof buttonVariants>

interface ButtonProps
  extends ButtonPrimitiveProps,
    Required<Omit<ButtonVariants, 'isDisabled'>>,
    Pick<ButtonVariants, 'isDisabled'> {
  leadingIcon?: React.ReactElement
  trailingIcon?: React.ReactElement
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const { isDisabled, isPending = false } = props

    return (
      <ButtonPrimitive
        ref={ref}
        {...props}
        isDisabled={isDisabled || isPending}
        className={(value) =>
          cn(
            buttonVariants({
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
              <BaseIcon icon={Spinner} size="sm" className="animate-spin" />
            ) : (
              props.trailingIcon
            )}
          </>
        )}
      </ButtonPrimitive>
    )
  }
)

export interface ButtonLinkProps
  extends LinkPrimitiveProps,
    Required<Omit<ButtonVariants, 'isDisabled'>>,
    Pick<ButtonVariants, 'isDisabled'> {
  leadingIcon?: React.ReactElement
  trailingIcon?: React.ReactElement
  isPending?: boolean
}

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
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
          buttonVariants({
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

export { Button, ButtonLink, type ButtonProps }
