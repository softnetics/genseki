import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '~/utils/cn'

const iconVariants = cva(null, {
  variants: {
    variant: {
      normal: `bg-bluegray-100`,
      'soft-shadow': `bg-gradient-to-b to-bluegray-200 from-bluegray-50`,
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

const IconContainer = ({ variant, size, icon }: IconVariants) => {
  return <div className={cn(iconVariants({ variant, size }))}>{icon}</div>
}

export default IconContainer
