'use client'

import {
  DatePicker as DatePickerPrimitive,
  type DatePickerProps as DatePickerPrimitiveProps,
  type DateValue,
  type DialogProps,
  I18nProvider,
  type PopoverProps,
  type ValidationResult,
} from 'react-aria-components'

import { CalendarDotsIcon } from '@phosphor-icons/react'
import { twJoin } from 'tailwind-merge'

import type { DateDuration } from '@internationalized/date'

import { Button } from './button'
import { Calendar } from './calendar'
import { DateInput } from './date-field'
import { Description, FieldError, FieldGroup, Label } from './field'
import { PopoverClose, PopoverContent } from './popover'
import { composeTailwindRenderProps } from './primitive'
import { RangeCalendar } from './range-calendar'

import { BaseIcon } from '../../components/primitives/base-icon'

interface DatePickerOverlayProps
  extends Omit<DialogProps, 'children' | 'className' | 'style'>,
    Omit<PopoverProps, 'children' | 'className' | 'style'> {
  className?: string | ((values: { defaultClassName?: string }) => string)
  children?: React.ReactNode
  closeButton?: boolean
  range?: boolean
  visibleDuration?: DateDuration
  pageBehavior?: 'visible' | 'single'
}

const DatePickerOverlay = ({
  visibleDuration = { months: 1 },
  closeButton = true,
  pageBehavior = 'visible',
  range,
  ...props
}: DatePickerOverlayProps) => {
  return (
    <PopoverContent
      isDismissable={false}
      showArrow={false}
      className={twJoin(
        'flex min-w-auto max-w-none snap-x justify-center p-8 sm:min-w-[16.5rem] sm:p-2 sm:pt-3',
        visibleDuration?.months === 1 ? 'sm:max-w-2xs' : 'sm:max-w-none'
      )}
      {...props}
    >
      {range ? (
        <RangeCalendar pageBehavior={pageBehavior} visibleDuration={visibleDuration} />
      ) : (
        <Calendar />
      )}
      {closeButton && (
        <div className="mx-auto flex w-full max-w-[inherit] justify-center py-8 sm:hidden">
          <PopoverClose variant="outline" size="md" className="w-full">
            Close
          </PopoverClose>
        </div>
      )}
    </PopoverContent>
  )
}

const DatePickerIcon = () => (
  <Button
    size="md"
    variant="vanish"
    className="-translate-x-2 rounded-full outline-offset-0 hover:bg-transparent pressed:bg-transparent **:data-[slot=icon]:text-muted-fg"
  >
    <BaseIcon icon={CalendarDotsIcon} weight="duotone" className="group-open:text-fg" aria-hidden />
  </Button>
)

interface DatePickerProps<T extends DateValue> extends DatePickerPrimitiveProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
}

const DatePicker = <T extends DateValue>({
  label,
  className,
  description,
  errorMessage,
  ...props
}: DatePickerProps<T>) => {
  const isInvalid = !!errorMessage || !!props.isInvalid
  return (
    <I18nProvider locale="en-GB">
      <DatePickerPrimitive
        {...props}
        isInvalid={isInvalid}
        className={composeTailwindRenderProps(className, 'group/date-picker flex flex-col gap-y-4')}
      >
        {label && (
          <Label>
            {label} {props.isRequired && <span className="ml-1 text-pumpkin-500">*</span>}
          </Label>
        )}
        <FieldGroup className="min-w-40">
          <DateInput size="md" className="w-full pr-16" />
          <DatePickerIcon />
        </FieldGroup>
        {description && <Description>{description}</Description>}
        <FieldError>{errorMessage}</FieldError>
        <DatePickerOverlay />
      </DatePickerPrimitive>
    </I18nProvider>
  )
}
export type { DatePickerProps, DateValue, ValidationResult }
export { DatePicker, DatePickerIcon, DatePickerOverlay }
