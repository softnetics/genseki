'use client'

import { forwardRef } from 'react'
import type {
  CheckboxGroupProps as CheckboxGroupPrimitiveProps,
  CheckboxProps as CheckboxPrimitiveProps,
  ValidationResult,
} from 'react-aria-components'
import {
  Checkbox as CheckboxPrimitive,
  CheckboxGroup as CheckboxGroupPrimitive,
  composeRenderProps,
} from 'react-aria-components'

import { Check, Minus } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import { Description, FieldError, Label } from './field'
import { composeTailwindRenderProps } from './primitive'

interface CheckboxGroupProps extends CheckboxGroupPrimitiveProps {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
}

const CheckboxGroup = forwardRef(function CheckboxGroup(
  { className, ...props }: CheckboxGroupProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <CheckboxGroupPrimitive
      ref={ref}
      {...props}
      className={composeTailwindRenderProps(className, 'flex flex-col gap-y-2')}
    >
      {props.label && <Label>{props.label}</Label>}
      <>{props.children as React.ReactNode}</>
      {props.description && <Description className="block">{props.description}</Description>}
      <FieldError>{props.errorMessage}</FieldError>
    </CheckboxGroupPrimitive>
  )
})

const checkboxStyles = tv({
  base: 'group flex items-center gap-2 text-sm transition',
  variants: {
    isDisabled: {
      true: 'opacity-50',
    },
  },
})

const boxStyles = tv({
  base: 'inset-ring inset-ring-fg/10 flex size-8 shrink-0 items-center justify-center rounded-sm text-bg transition *:data-[slot=icon]:size-6',
  variants: {
    isSelected: {
      false: 'bg-muted',
      true: [
        'border-primary bg-primary text-primary-fg',
        'group-invalid:border-danger/70 group-invalid:bg-danger group-invalid:text-danger-fg',
      ],
    },
    isFocused: {
      true: [
        'border-primary ring-4 ring-primary/20',
        'group-invalid:border-danger/70 group-invalid:text-danger-fg group-invalid:ring-danger/20',
      ],
    },
    isInvalid: {
      true: 'border-danger/70 bg-danger/20 text-danger-fg ring-danger/20',
    },
  },
})

interface CheckboxProps extends CheckboxPrimitiveProps {
  description?: string
  label?: string
}

const Checkbox = forwardRef(function Checkbox(
  { className, ...props }: CheckboxProps,
  ref: React.ForwardedRef<HTMLLabelElement>
) {
  return (
    <CheckboxPrimitive
      ref={ref}
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        checkboxStyles({ ...renderProps, className })
      )}
    >
      {({ isSelected, isIndeterminate, ...renderProps }) => (
        <div
          className={twMerge('flex gap-x-2', props.description ? 'items-start' : 'items-center')}
        >
          <div
            className={boxStyles({
              ...renderProps,
              isSelected: isSelected || isIndeterminate,
            })}
          >
            {isIndeterminate ? (
              <Minus weight="bold" />
            ) : isSelected ? (
              <Check weight="bold" />
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <>
              {props.label ? (
                <Label className={twMerge(props.description && 'text-sm/4 font-normal')}>
                  {props.label}
                </Label>
              ) : (
                (props.children as React.ReactNode)
              )}
              {props.description && <Description>{props.description}</Description>}
            </>
          </div>
        </div>
      )}
    </CheckboxPrimitive>
  )
})

export type { CheckboxGroupProps, CheckboxProps }
export { Checkbox, CheckboxGroup }
