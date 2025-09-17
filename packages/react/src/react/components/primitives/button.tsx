'use client'
import React, { forwardRef } from 'react'
import type { LinkProps as LinkPrimitiveProps } from 'react-aria-components'
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  Link,
} from 'react-aria-components'

import { Spinner, SpinnerIcon } from '@phosphor-icons/react'
import { tv, type VariantProps } from 'tailwind-variants'

import { BaseIcon } from './base-icon'

import { cn } from '../../utils/cn'

const buttonVariants = tv({
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
        data-xxx="xxx"
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
