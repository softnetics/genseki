import type React from 'react'

import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '../../../utils/cn'

const layout = tv({
  base: 'mx-auto w-full my-24 px-8 lg:px-0 flex flex-col gap-y-4',
  variants: {
    size: {
      sm: 'lg:max-w-200',
      md: 'lg:max-w-320',
      lg: 'lg:max-w-420',
    },
    display: {
      flex: undefined,
      'grid-2': '[&_form]:grid [&_form]:grid-cols-2 [&_form]:gap-4 [&_.submit-btn]:col-span-2',
      'grid-3': '[&_form]:grid [&_form]:grid-cols-3 [&_form]:gap-4 [&_.submit-btn]:col-span-3',
    },
  },
  defaultVariants: {
    size: 'md',
    display: 'flex',
  },
})

type LayoutVariants = VariantProps<typeof layout>

interface FormLayoutProps extends LayoutVariants {
  children?: React.ReactNode
  className?: string
  banner?: React.ReactNode
}

export const CollectionFormLayout = (props: FormLayoutProps) => {
  return (
    <>
      {props.banner}
      <div className={cn(layout({ size: props.size, display: props.display }), props.className)}>
        {props.children}
      </div>
    </>
  )
}
