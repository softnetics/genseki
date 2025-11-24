import { cva } from 'class-variance-authority'

export const linkVariants = cva('text-sm font-medium text-primary', {
  variants: {
    variant: {
      plain: null,
      underline: 'underline-offset-4 hover:underline hover:border-0',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'underline',
    size: 'sm',
  },
})
