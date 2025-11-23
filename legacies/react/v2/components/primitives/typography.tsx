import React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../../src/react/utils/cn'

type TypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'label' | 'caption'

const nativeElementsMap: Record<TypographyTag, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  caption: 'p',
  label: 'p',
}

const typographyVariants = cva('inline-block', {
  variants: {
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    type: {
      h1: 'text-3xl',
      h2: 'text-2xl',
      h3: 'text-xl',
      h4: 'text-lg',
      body: 'text-base',
      caption: 'text-sm',
      label: 'text-xs',
    },
  },
})

interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  type?: TypographyTag
  asChild?: boolean
}

export const Typography = ({
  type = 'body',
  weight = 'normal',
  className,
  asChild = false,
  ...props
}: TypographyProps) => {
  const Component = asChild ? Slot : nativeElementsMap[type]

  return <Component {...props} className={cn(typographyVariants({ weight, type }), className)} />
}
