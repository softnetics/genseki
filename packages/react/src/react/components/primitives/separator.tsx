'use client'

import { Separator as Divider, type SeparatorProps } from 'react-aria-components'

import { twMerge } from 'tailwind-merge'

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
