'use client'

import {
  DateField as DateFieldPrimitive,
  type DateFieldProps as DateFieldPrimitiveProps,
  DateInput as DateInputPrimitive,
  type DateInputProps,
  DateSegment,
  type DateValue,
  type ValidationResult,
} from 'react-aria-components'

import { tv, type VariantProps } from 'tailwind-variants'

import { Description, FieldError, FieldGroup, Label } from './field'
import { composeTailwindRenderProps } from './primitive'

import { cn } from '../../utils/cn'

const DateInputVariants = tv({
  base: 'box-content rounded-md',
  variants: {
    size: {
      md: `p-6 [&>[data-slot=prefix]]:pl-4 [&>[data-slot=suffix]]:pr-4`,
      sm: `p-4 [&>[data-slot=prefix]]:pl-2 [&>[data-slot=suffix]]:pr-2`,
      xs: `p-2 [&>[data-slot=prefix]]:pl-2 [&>[data-slot=suffix]]:pr-2`,
    },
  },
  defaultVariants: { size: 'md' },
})

interface DateFieldProps<T extends DateValue>
  extends DateFieldPrimitiveProps<T>,
    VariantProps<typeof DateInputVariants> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const DateField = <T extends DateValue>({
  prefix,
  suffix,
  label,
  description,
  errorMessage,
  size,
  ...props
}: DateFieldProps<T>) => {
  const isInvalid = !!errorMessage || !!props.isInvalid
  return (
    <DateFieldPrimitive
      isInvalid={isInvalid}
      className={composeTailwindRenderProps(props.className, 'group flex flex-col gap-y-1.5')}
      {...props}
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
        <DateInput size={size} />
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
    </DateFieldPrimitive>
  )
}

const segmentStyles = tv({
  base: 'inline shrink-0 rounded-sm p-1 type-literal:px-0 text-fg tabular-nums tracking-wider caret-transparent outline-0 forced-color-adjust-none sm:text-base forced-colors:text-[ButtonText]',
  variants: {
    isPlaceholder: {
      true: 'text-muted-fg',
    },
    isDisabled: {
      true: 'text-fg/50 forced-colors:text-[GrayText]',
    },
    isFocused: {
      true: [
        'bg-accent text-accent-fg forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]',
        'data-invalid:bg-danger data-invalid:text-danger-fg',
      ],
    },
  },
})

const DateInput = ({
  className,
  size,
  ...props
}: Omit<DateInputProps, 'children'> & VariantProps<typeof DateInputVariants>) => {
  return (
    <DateInputPrimitive
      className={(value) =>
        cn(
          'bg-transparent text-base text-fg placeholder-muted-fg space-x-2',
          DateInputVariants({
            size,
            className: typeof className === 'function' ? className(value) : className,
          })
        )
      }
      {...props}
    >
      {(segment) => <DateSegment segment={segment} className={segmentStyles} />}
    </DateInputPrimitive>
  )
}

export type { DateFieldProps }
export { DateField, DateInput, segmentStyles }
