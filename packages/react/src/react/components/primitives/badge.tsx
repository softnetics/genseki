import { tv, type VariantProps } from 'tailwind-variants'

const badgeIntents = {
  gray: 'bg-white border-gray-300 text-text-body',
  brand: 'bg-pumpkin-50 text-text-accent border-pumpkin-300',
  blue: 'bg-ocean-50 text-ocean-500 border-ocean-300',
  red: 'bg-red-50 text-red-500 border-red-300',
  yellow: 'bg-yellow-50 text-yellow-500 border-yellow-300',
  green: 'bg-palm-50 text-palm-500 border-palm-300',
  purple: 'bg-purple-50 text-purple-500 border-purple-300',
  cyan: 'bg-cyan-50 text-cyan-500 border-cyan-300',
}
const badgeShapes = {
  square: 'px-2 py-2 rounded-md',
  circle: 'px-2 py-2 rounded-full',
}
const sizeStyles = {
  sm: 'text-xs px-4',
  md: 'text-sm px-5 py-1',
  lg: 'text-sm px-6 py-2',
}
const badgeStyles = tv({
  base: 'inline-flex items-center font-medium border **:data-[slot=icon]:size-3 forced-colors:outline',
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
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeStyles> {
  className?: string
  children: React.ReactNode
}

const Badge = ({ children, intent, shape, size, className, ...props }: BadgeProps) => {
  return (
    <span {...props} className={badgeStyles({ intent, shape, size, className })}>
      {children}
    </span>
  )
}

export type { BadgeProps }
export { Badge, badgeIntents, badgeShapes, badgeStyles }
