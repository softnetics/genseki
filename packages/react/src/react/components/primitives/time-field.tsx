'use client'

import {
  TimeField as TimeFieldPrimitive,
  type TimeFieldProps as TimeFieldPrimitiveProps,
  type TimeValue,
  type ValidationResult,
} from 'react-aria-components'

import { DateInput } from './date-field'
import { Description, FieldError, FieldGroup, Label } from './field'
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
      className={composeTailwindRenderProps(className, 'group/time-field flex flex-col gap-y-1.5')}
    >
      {label && (
        <Label>
          {label} {props.isRequired && <span className="ml-1 text-red-500">*</span>}
        </Label>
      )}
      <FieldGroup>
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
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </TimeFieldPrimitive>
  )
}

export type { TimeFieldProps }
export { TimeField }
