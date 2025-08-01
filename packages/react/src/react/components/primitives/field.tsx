'use client'

import { forwardRef } from 'react'
import type {
  FieldErrorProps as FieldErrorPrimitiveProps,
  GroupProps,
  InputProps as InputPrimitiveProps,
  LabelProps,
  TextFieldProps as TextFieldPrimitiveProps,
  TextProps,
  ValidationResult,
} from 'react-aria-components'
import {
  composeRenderProps,
  FieldError as FieldErrorPrimitive,
  Group,
  Input as InputPrimitive,
  Label as LabelPrimitive,
  Text,
} from 'react-aria-components'

import { tv } from 'tailwind-variants'

import { composeTailwindRenderProps, focusStyles } from './primitive'

interface FieldProps {
  label?: string
  placeholder?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  'aria-label'?: TextFieldPrimitiveProps['aria-label']
  'aria-labelledby'?: TextFieldPrimitiveProps['aria-labelledby']
}

const fieldStyles = tv({
  slots: {
    description: 'text-pretty text-secondary-fg text-sm',
    label: 'w-fit cursor-default font-semibold text-fg text-base',
    fieldError: 'text-red-500 text-sm forced-colors:text-[Mark]',
  },
})

const { description, label, fieldError } = fieldStyles()

const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...props },
  ref
) {
  return <LabelPrimitive ref={ref} {...props} className={label({ className })} />
})

interface DescriptionProps extends TextProps {
  isWarning?: boolean
  ref?: React.RefObject<HTMLElement>
}

const Description = forwardRef<HTMLElement, DescriptionProps>(function Description(
  { className, isWarning, ...props },
  ref
) {
  return (
    <Text
      ref={ref}
      {...props}
      slot="description"
      className={description({ className: isWarning ? 'text-warning' : className })}
    />
  )
})

interface FieldErrorProps extends FieldErrorPrimitiveProps {
  ref?: React.RefObject<HTMLElement>
}
const FieldError = forwardRef<HTMLElement, FieldErrorProps>(function FieldError(
  { className, ...props },
  ref
) {
  return (
    <FieldErrorPrimitive
      ref={ref}
      {...props}
      className={composeTailwindRenderProps(className, fieldError())}
    />
  )
})

const fieldGroupStyles = tv({
  base: [
    'group flex items-center overflow-hidden rounded-md border border-input shadow-sm transition duration-200 ease-out',
    'relative focus-within:ring-4 group-invalid:focus-within:border-danger group-invalid:focus-within:ring-danger/20',
    '[&>[role=progressbar]:first-child]:ml-2.5 [&>[role=progressbar]:last-child]:mr-2.5',
    '**:data-[slot=icon]:shrink-0 **:[button]:shrink-0',
    '[&>button:has([data-slot=icon]):first-child]:left-0 [&>button:has([data-slot=icon]):last-child]:right-0 [&>button:has([data-slot=icon])]:absolute',
    '*:data-[slot=icon]:pointer-events-none *:data-[slot=icon]:absolute *:data-[slot=icon]:top-[calc(var(--spacing)*2.7)] *:data-[slot=icon]:z-10 *:data-[slot=icon]:size-4 *:data-[slot=icon]:text-muted-fg',
    '[&>[data-slot=icon]:first-child]:left-2.5 [&>[data-slot=icon]:last-child]:right-2.5',
    '[&:has([data-slot=icon]+input)]:pl-6 [&:has(input+[data-slot=icon])]:pr-6',
    '[&:has([data-slot=icon]+[role=group])]:pl-6 [&:has([role=group]+[data-slot=icon])]:pr-6',
    'has-[[data-slot=icon]:last-child]:[&_input]:pr-7',
    '*:[button]:h-8 *:[button]:rounded-[calc(var(--radius-sm)-1px)] *:[button]:px-2.5',
    '[&>button:first-child]:ml-[calc(var(--spacing)*0.7)] [&>button:last-child]:mr-[calc(var(--spacing)*0.7)]',
  ],
  variants: {
    isFocusWithin: focusStyles.variants.isFocused,
    isInvalid: focusStyles.variants.isInvalid,
    isDisabled: {
      true: 'opacity-80 bg-muted forced-colors:border-[GrayText]',
    },
  },
})

interface FieldGroupProps extends GroupProps {
  ref?: React.RefObject<HTMLDivElement>
}
const FieldGroup = forwardRef<HTMLDivElement, FieldGroupProps>(function FieldGroup(
  { className, ...props },
  ref
) {
  return (
    <Group
      {...props}
      ref={ref}
      className={composeRenderProps(className, (className, renderProps) =>
        fieldGroupStyles({
          ...renderProps,
          className,
        })
      )}
    />
  )
})

interface InputProps extends InputPrimitiveProps {}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <InputPrimitive
      ref={ref}
      {...props}
      className={composeTailwindRenderProps(
        className,
        'text-fg placeholder-text-body outline-hidden focus:outline-hidden w-full min-w-0 bg-transparent p-4 text-base [&::-ms-reveal]:hidden [&::-webkit-search-cancel-button]:hidden'
      )}
    />
  )
})

export type { FieldErrorProps, FieldProps, InputProps }
export { Description, FieldError, FieldGroup, fieldStyles, Input, Label }
