'use client'
import { cn } from '../../../src/react/utils/cn'

function Input({
  className,
  type,
  isError,
  ...props
}: React.ComponentProps<'input'> & { isError?: boolean }) {
  return (
    <input
      type={type}
      className={cn(
        'bg-background file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-18 w-full min-w-0 rounded-md border px-6 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:bg-transparent file:rounded-sm file:px-4 file:h-full file:border-0 file:text-sm file:font-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-text-disabled disabled:border-border-primary disabled:placeholder:text-text-disabled',
        'focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[2px]',
        'aria-invalid:ring-destructive dark:aria-invalid:ring-destructive aria-invalid:border-destructive',
        className
      )}
      data-slot="input"
      aria-invalid={isError}
      {...props}
    />
  )
}

type InputProps = React.ComponentPropsWithRef<typeof Input>

export { Input, type InputProps }
