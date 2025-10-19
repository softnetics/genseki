import * as React from 'react'

import { cn } from '../../../src/react/utils/cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring aria-invalid:ring-destructive dark:aria-invalid:ring-destructive aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-32 w-full rounded-md border bg-transparent px-7 py-6 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[2px]',
        'disabled:pointer-events-none disabled::cursor-not-allowed disabled:text-text-disabled disabled:border-border-primary disabled:placeholder:text-text-disabled',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
