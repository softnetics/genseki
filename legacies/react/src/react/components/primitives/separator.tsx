'use client'

import { Separator as Divider, type SeparatorProps as SeparatorProps } from 'react-aria-components'

import { twMerge } from 'tailwind-merge'

/**
 * React Aria component
 */

/**
 * @deprecated
 */
export const Separator = ({ orientation = 'horizontal', className, ...props }: SeparatorProps) => {
  return (
    <Divider
      {...props}
      className={twMerge(
        'bg-border shrink-0 forced-colors:bg-[ButtonBorder]',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
    />
  )
}

export type { SeparatorProps }
