'use client'

import { Link as LinkPrimitive, type LinkProps as LinkPrimitiveProps } from 'react-aria-components'

import { twJoin } from 'tailwind-merge'

import { composeTailwindRenderProps } from './primitive'

/**
 * @deprecated
 */
interface LinkProps extends LinkPrimitiveProps {
  intent?: 'primary' | 'secondary' | 'unstyled'
  ref?: React.RefObject<HTMLAnchorElement>
}

/**
 * @deprecated
 * Use anchor tag instead
 */
const Link = ({ className, ref, intent = 'unstyled', ...props }: LinkProps) => {
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

export { Link, type LinkProps }
