'use client'
import React from 'react'

import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Shadcn component
 */

const separator = cva('shrink-0', {
  variants: {
    variant: {
      solid:
        'bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      dashed: `bg-size-[12px_12px] bg-repeat
        data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=horizontal]:bg-[linear-gradient(to_right,var(--color-border-primary)_50%,transparent_50%)]
        data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px data-[orientation=vertical]:bg-[linear-gradient(to_bottom,var(--color-border-primary)_50%,transparent_50%)]
        `,
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
})

type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root> &
  VariantProps<typeof separator>

function Separator({
  className,
  orientation = 'horizontal',
  variant,
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={separator({ variant, className })}
      {...props}
    />
  )
}

export { Separator }
