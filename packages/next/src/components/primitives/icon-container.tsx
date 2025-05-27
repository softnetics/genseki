import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '../../utils/cn'

const iconVariants = tv({
  variants: {
    variant: {
      normal: `bg-secondary`,
      'soft-shadow': `bg-gradient-to-b to-secondary-fg/20 dark:to-secondary-fg/10 from-secondary`,
      ghost: 'text-text-body',
    },
    size: {
      md: 'p-6 gap-x-2 rounded-md',
      sm: 'p-4 gap-x-2 rounded-md',
      xs: 'p-2 gap-x-1 rounded-sm',
      xxs: 'p-1 gap-x-1 rounded-xs',
    },
  },
  defaultVariants: {
    variant: 'normal',
    size: 'sm',
  },
})

type IconVariants = Required<VariantProps<typeof iconVariants>> & {
  icon: React.ReactElement
}

export const IconContainer = ({ variant, size, icon }: IconVariants) => {
  return <div className={cn(iconVariants({ variant, size }))}>{icon}</div>
}
