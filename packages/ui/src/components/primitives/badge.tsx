import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'

const badgeIntents = {
  gray: 'bg-white border-gray-300 text-text-secondary',
  brand: 'bg-pumpkin-50 text-text-brand border-pumpkin-300',
  blue: 'bg-surface-info text-ocean-500 border-ocean-300',
  red: 'bg-surface-incorrect text-red-500 border-red-300',
  yellow: 'bg-surface-accent text-yellow-500 border-yellow-300',
  green: 'bg-palm-50 text-palm-500 border-palm-300',
  purple: 'bg-purple-50 text-purple-500 border-purple-300',
  cyan: 'bg-cyan-50 text-cyan-500 border-cyan-300',
}
const badgeShapes = {
  square: 'rounded-md',
  circle: 'rounded-full',
}
const sizeStyles = {
  sm: 'text-xs px-4 py-1 gap-2',
  md: 'text-sm px-5 py-1 gap-2',
  lg: 'text-sm px-6 py-2 gap-4',
}

const badgeStyles = cva('inline-flex items-center font-medium border forced-colors:outline', {
  variants: {
    intent: { ...badgeIntents },
    shape: { ...badgeShapes },
    size: { ...sizeStyles },
  },
  defaultVariants: {
    intent: 'gray',
    shape: 'circle',
    size: 'md',
  },
})

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeStyles> {
  className?: string
  children: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Badge = ({
  children,
  intent,
  shape,
  size,
  className,
  leftIcon,
  rightIcon,
  ...props
}: BadgeProps) => {
  return (
    <span {...props} className={cn(badgeStyles({ intent, shape, size }), className)}>
      {leftIcon}
      {children}
      {rightIcon}
    </span>
  )
}

export type { BadgeProps }
export { Badge, badgeIntents, badgeShapes, badgeStyles }
