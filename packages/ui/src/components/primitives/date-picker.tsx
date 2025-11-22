'use client'

import * as React from 'react'

import { CalendarBlankIcon } from '@phosphor-icons/react'
import { useControllableState } from '@radix-ui/react-use-controllable-state'

import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Typography } from './typography'

import { createRequiredContext } from '../../hooks/create-required-context'
import { cn } from '../../utils/cn'

const [_DatePickerProvider, useDatePickerProvider] = createRequiredContext<{
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}>('Datepicker provider')

export function DatePickerProvider(props: React.ComponentPropsWithRef<typeof Popover>) {
  const [open, setOpen] = useControllableState<boolean>({
    defaultProp: false,
    prop: props.open,
    onChange: props.onOpenChange,
  })

  return (
    <_DatePickerProvider open={open} onOpenChange={setOpen}>
      <Popover {...props} open={open} onOpenChange={setOpen} />
    </_DatePickerProvider>
  )
}

export function DatePickerTrigger({
  asChild,
  value,
  children,
  formatDate,
  ...props
}: {
  asChild?: boolean
  value?: Date
  formatDate?: (value: Date | undefined) => string | number | undefined
} & Omit<React.ComponentPropsWithRef<typeof PopoverTrigger>, 'value'>) {
  const { onOpenChange } = useDatePickerProvider()

  const displayValue = formatDate ? formatDate(value) : value?.toLocaleDateString()

  return (
    <PopoverTrigger
      asChild
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          onOpenChange(true)
        }
      }}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <Button
          variant="outline"
          data-empty={!value}
          className={cn(
            'data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal',
            props.className
          )}
        >
          <CalendarBlankIcon />
          <Typography>{displayValue || 'Pick a date'}</Typography>
        </Button>
      )}
    </PopoverTrigger>
  )
}

export function DatePickerContent({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof PopoverContent>) {
  return <PopoverContent className={cn('w-auto p-0', className)} {...props} />
}
