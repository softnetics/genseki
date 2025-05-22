import React from 'react'

import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '../../utils/cn'

type TypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'label' | 'caption'

type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold'

const nativeElementsMap: Record<TypographyTag, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  caption: 'p',
  label: 'p',
}

const typographyVariants = tv({
  base: 'inline-block',
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

type TypographyProps = {
  type: TypographyTag
} & React.HTMLAttributes<HTMLElement> &
  Required<VariantProps<typeof typographyVariants>>

export const Typography = ({ children, type, weight, className, ...props }: TypographyProps) => {
  const Component = nativeElementsMap[type]

  return (
    <Component className={cn(typographyVariants({ weight, type }), className)} {...props}>
      {children}
    </Component>
  )
}
