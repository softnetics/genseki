'use client'
import React, { forwardRef } from 'react'
import type { LinkProps as LinkPrimitiveProps } from 'react-aria-components'
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  Link,
} from 'react-aria-components'

import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '../../utils/cn'

const buttonVariants = tv({
  base: 'cursor-pointer flex items-center justify-center',
  variants: {
    variant: {
      primary: `brand-primary-gradient-25% hover:brand-primary-gradient-15% [&>*]:text-white text-white
        shadow-[0_0_0_0.8px_var(--color-primary-emphasis),0_1px_3px_0_var(--color-primary),inset_0_1.5px_0_0_--alpha(var(--color-white)/20%)]`,
      secondary: `brand-secondary-gradient-10% hover:brand-secondary-gradient-20% [&>*]:text-accent text-accent
        shadow-[0_0_0_0.8px_var(--color-primary-emphasis),0_1px_2px_0_var(--color-primary),inset_0_1.5px_0_0_--alpha(var(--color-white)/20%)]`,
      tertiary: `bg-primary/15 dark:bg-primary/20 dark:hover:bg-primary/15 hover:bg-primary/25 [&>*]:text-accent text-accent`,
      naked:
        '[&>*]:text-secondary-fg text-secondary-fg bg-bg hover:shadow-sm transition-shadow shadow-md dark:shadow-bg border-b border-stroke-trivial/10',
      outline:
        '[&>*]:text-secondary-fg text-secondary-fg hover:bg-secondary shadow-[inset_0_0_0_1px_var(--color-secondary)] bg-bg [background-image:radial-gradient(150%_90%_at_50%_50%,var(--color-bg)_40%,--alpha(var(--color-secondary-fg)/20%))]',
      ghost: '[&>*]:text-secondary-fg text-secondary-fg hover:bg-secondary',
      vanish: '[&>*]:text-secondary-fg text-secondary-fg',
      destruction:
        '[&>*]:text-white text-white bg-valencia-500 hover:bg-valencia-600 shadow-[inset_0_0_0_1px_var(--color-valencia-600),inset_0_2px_0_0_--alpha(var(--color-white)/20%)]',
    },
    size: {
      md: 'p-6 gap-x-2 rounded-md text-base font-medium',
      sm: 'p-4 gap-x-2 rounded-md text-sm font-medium',
      xs: 'p-2 gap-x-1 rounded-sm text-sm font-medium',
      xxs: 'p-1 gap-x-1 rounded-xs text-xs font-medium',
    },
    isDisabled: {
      true: 'opacity-50 cursor-not-allowed pointer-events-none',
      false: null,
    },
  },
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
    const { isDisabled } = props

    return (
      <ButtonPrimitive
        ref={ref}
        {...props}
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
            {props.trailingIcon}
          </>
        )}
      </ButtonPrimitive>
    )
  }
)

interface ButtonLinkProps
  extends LinkPrimitiveProps,
    Required<Omit<ButtonVariants, 'isDisabled'>>,
    Pick<ButtonVariants, 'isDisabled'> {
  leadingIcon?: React.ReactElement
  trailingIcon?: React.ReactElement
}

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { className, variant, size, isDisabled = false, children, ...props },
  ref
) {
  return (
    <Link
      ref={ref}
      data-slot="button"
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
          {props.trailingIcon}
        </>
      )}
    </Link>
  )
})

export { Button, ButtonLink, type ButtonProps }
