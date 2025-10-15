'use client'

import { Link as LinkPrimitive, type LinkProps as LinkPrimitiveProps } from 'react-aria-components'

import { cva } from 'class-variance-authority'
import { twJoin } from 'tailwind-merge'

import { composeTailwindRenderProps } from './primitive'

/**
 * @deprecated
 */
interface AriaLinkProps extends LinkPrimitiveProps {
  intent?: 'primary' | 'secondary' | 'unstyled'
  ref?: React.RefObject<HTMLAnchorElement>
}

/**
 * @deprecated
 * Use anchor tag instead
 */
const AriaLink = ({ className, ref, intent = 'unstyled', ...props }: AriaLinkProps) => {
  return (
    <LinkPrimitive
      ref={ref}
      {...props}
      className={composeTailwindRenderProps(
        className,
        twJoin([
          'focus-visible:outline-ring outline-0 outline-offset-2 transition-[color,_opacity] focus-visible:outline-2 forced-colors:outline-[Highlight] w-fit',
          'disabled:cursor-default disabled:opacity-60 forced-colors:disabled:text-[GrayText]',
          intent === 'unstyled' && 'text-current',
          intent === 'primary' && 'text-primary hover:underline',
          intent === 'secondary' && 'text-secondary-fg hover:underline',
        ])
      )}
    >
      {(values) => (
        <>{typeof props.children === 'function' ? props.children(values) : props.children}</>
      )}
    </LinkPrimitive>
  )
}

export type { AriaLinkProps }
export { AriaLink }

export const linkVariants = cva('text-sm font-medium text-primary', {
  variants: {
    variant: {
      plain: null,
      underline: 'underline-offset-4 hover:underline hover:border-0',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'underline',
    size: 'sm',
  },
})
