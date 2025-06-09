import type { Icon } from '@phosphor-icons/react'
import { PlusCircleIcon } from '@phosphor-icons/react/dist/ssr'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '../../utils/cn'

const iconVariants = tv({
  base: 'text-text-body',
  variants: {
    size: {
      xl: 'size-15',
      lg: 'size-12',
      md: 'size-10',
      sm: 'size-7',
      xs: 'size-6',
    },
  },
})

type BaseIconProps = { icon?: Icon } & VariantProps<typeof iconVariants> &
  React.ComponentPropsWithoutRef<Icon>

export const BaseIcon = ({
  icon: Icon = PlusCircleIcon,
  size = 'sm',
  className,
  ...props
}: BaseIconProps) => {
  return <Icon data-slot="icon" className={cn(iconVariants({ size }), className)} {...props} />
}
