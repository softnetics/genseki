import type { Icon } from '@phosphor-icons/react/dist/lib/types'
import { PlusCircle } from '@phosphor-icons/react/dist/ssr'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/utils/cn'

const iconVariants = cva('text-text-body', {
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

const BaseIcon = ({ icon: Icon = PlusCircle, size = 'sm', className, ...props }: BaseIconProps) => {
  return <Icon data-slot="icon" className={cn(iconVariants({ size }), className)} {...props} />
}

export default BaseIcon
