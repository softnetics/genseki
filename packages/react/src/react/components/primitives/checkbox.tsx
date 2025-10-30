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

import { CheckIcon, MinusIcon } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import { Description, FieldError, Label } from './field'
import { composeTailwindRenderProps } from './primitive'

import { cn } from '../../utils/cn'

/**
 * @deprecated
 */
interface CheckboxGroupProps extends CheckboxGroupPrimitiveProps {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
}

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
const checkboxStyles = tv({
  base: 'group flex items-center gap-2 text-sm transition',
  variants: {
    isDisabled: {
      true: 'opacity-50',
    },
  },
})

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
interface CheckboxProps extends CheckboxPrimitiveProps {
  description?: string
  errorMessage?: string
  label?: string
  size?: 'md' | 'lg'
  isTextCenter?: boolean
}

/**
 * @deprecated
 */
const Checkbox = forwardRef(function Checkbox(
  { className, size = 'md', isTextCenter = true, ...props }: CheckboxProps,
  ref: React.ForwardedRef<HTMLLabelElement>
) {
  // If provide only 1 thing then center
  // const shouldCenter = [props.description, props.label].filter((item) => !!item).length == 1

  const sizeClasses = {
    md: {
      box: 'size-8',
      label: 'text-base font-medium leading-[100%]',
      description: 'text-base',
    },
    lg: {
      box: 'size-12',
      label: 'text-lg font-medium leading-[100%]',
      description: 'text-lg',
    },
  }

  return (
    <CheckboxPrimitive
      ref={ref}
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        checkboxStyles({ ...renderProps, className })
      )}
    >
      {({ isSelected, isDisabled, isIndeterminate, ...renderProps }) => {
        return (
          <div
            className={twMerge(
              'flex gap-4',
              isTextCenter ? 'items-center' : 'items-start',
              isDisabled && 'cursor-not-allowed'
            )}
          >
            <div
              className={boxStyles({
                ...renderProps,
                isSelected: isSelected || isIndeterminate,
              })}
            >
              {isIndeterminate ? (
                <MinusIcon weight="bold" />
              ) : isSelected ? (
                <CheckIcon weight="bold" />
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <>
                {props.label ? (
                  <Label className={cn(props.description, sizeClasses[size].label)}>
                    {props.label}
                    {props.isRequired && <span className="ml-1 text-text-brand">*</span>}
                  </Label>
                ) : (
                  (props.children as React.ReactNode)
                )}
                {props.description && <Description>{props.description}</Description>}
              </>
            </div>
          </div>
        )
      }}
    </CheckboxPrimitive>
  )
})

export type { CheckboxGroupProps, CheckboxProps }
export { Checkbox, CheckboxGroup }
