'use client'

import {
  TimeField as TimeFieldPrimitive,
  type TimeFieldProps as TimeFieldPrimitiveProps,
  type TimeValue,
  type ValidationResult,
} from 'react-aria-components'

import { DateInput } from './date-field'
import { AriaDescription, AriaFieldError, AriaFieldGroup, AriaLabel } from './field'
import { composeTailwindRenderProps } from './primitive'

interface TimeFieldProps<T extends TimeValue> extends TimeFieldPrimitiveProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const TimeField = <T extends TimeValue>({
  prefix,
  suffix,
  label,
  className,
  description,
  errorMessage,
  ...props
}: TimeFieldProps<T>) => {
  const isInvalid = !!errorMessage || !!props.isInvalid
  return (
    <TimeFieldPrimitive
      hourCycle={24}
      {...props}
      isInvalid={isInvalid}
      className={composeTailwindRenderProps(className, 'group/time-field flex flex-col gap-y-4')}
    >
      {label && (
        <AriaLabel>
          {label} {props.isRequired && <span className="ml-1 text-text-brand">*</span>}
        </AriaLabel>
      )}
      <AriaFieldGroup>
        {prefix && typeof prefix === 'string' ? (
          <span className="ml-2 text-muted-fg">{prefix}</span>
        ) : (
          prefix
        )}
        <DateInput className="flex w-fit min-w-28 justify-around whitespace-nowra p-6 sm:text-sm" />
        {suffix ? (
          typeof suffix === 'string' ? (
            <span className="mr-2 text-muted-fg">{suffix}</span>
          ) : (
            suffix
          )
        ) : null}
      </AriaFieldGroup>
      {description && <AriaDescription>{description}</AriaDescription>}
      <AriaFieldError>{errorMessage}</AriaFieldError>
    </TimeFieldPrimitive>
  )
}

export type { TimeFieldProps }
export { TimeField }
