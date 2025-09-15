'use client'

import type {
  RadioGroupProps as RadioGroupPrimitiveProps,
  RadioProps as RadioPrimitiveProps,
} from 'react-aria-components'
import {
  composeRenderProps,
  Radio as RadioPrimitive,
  RadioGroup as RadioGroupPrimitive,
} from 'react-aria-components'

import { twMerge } from 'tailwind-merge'

import { Description, FieldError, type FieldProps, Label } from './field'
import { composeTailwindRenderProps } from './primitive'

interface RadioGroupProps extends RadioGroupPrimitiveProps, Omit<FieldProps, 'placeholder'> {}

const RadioGroup = ({
  className,
  label,
  description,
  errorMessage,
  children,
  ...props
}: RadioGroupProps) => {
  return (
    <RadioGroupPrimitive
      {...props}
      className={composeTailwindRenderProps(
        className,
        'space-y-3 has-[[slot=description]]:space-y-6 has-[[slot=description]]:**:data-[slot=label]:font-medium **:[[slot=description]]:block'
      )}
    >
      {(values) => (
        <>
          {label && <Label>{label}</Label>}
          {description && <Description>{description}</Description>}
          {typeof children === 'function' ? children(values) : children}
          <FieldError>{errorMessage}</FieldError>
        </>
      )}
    </RadioGroupPrimitive>
  )
}

interface RadioProps extends RadioPrimitiveProps, Pick<FieldProps, 'label' | 'description'> {
  size?: 'sm' | 'md'
}

const Radio = ({ className, children, description, label, size = 'md', ...props }: RadioProps) => {
  const sizeClasses = {
    sm: {
      indicator: 'size-8 before:size-2',
    },
    md: {
      indicator: 'size-10 before:size-3',
    },
  }

  return (
    <RadioPrimitive
      {...props}
      className={composeTailwindRenderProps(className, 'group block disabled:opacity-50 ')}
    >
      {composeRenderProps(
        children,
        (children, { isSelected, isFocusVisible, isInvalid, isDisabled }) => {
          const isStringChild = typeof children === 'string'
          const hasCustomChildren = typeof children !== 'undefined'

          const content = hasCustomChildren ? (
            isStringChild ? (
              <Label>{children}</Label>
            ) : (
              children
            )
          ) : (
            <>
              {label && <Label>{label}</Label>}
              {description && <Description>{description}</Description>}
            </>
          )

          return (
            <div
              className={twMerge(
                `flex gap-x-3 gap-y-1 items-center transition-all duration-200`,
                '*:data-[slot=indicator]:col-start-1 *:data-[slot=indicator]:row-start-1 *:data-[slot=indicator]:mt-0.75 sm:*:data-[slot=indicator]:mt-1',
                '*:data-[slot=label]:col-start-2 *:data-[slot=label]:row-start-1',
                '*:[[slot=description]]:col-start-2 *:[[slot=description]]:row-start-2',
                'has-[[slot=description]]:**:data-[slot=label]:font-medium'
              )}
            >
              <button
                data-slot="indicator"
                className={twMerge([
                  `relative inset-bluegray-300 isolate flex ${sizeClasses[size].indicator} shrink-0 items-center justify-center rounded-full bg-secondary text-bg transition before:absolute before:inset-auto before:shrink-0 before:rounded-full before:content-['']`,
                  `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus:outline-none border border-bluegray-400`,
                  isSelected && [
                    'bg-primary text-primary-fg before:bg-white',
                    'group-invalid:inset-ring-danger/70 group-invalid:bg-danger group-invalid:text-danger-fg',
                  ],
                  isFocusVisible && [
                    'inset-ring-primary ring-3 ring-ring/20',
                    'group-invalid:inset-ring-danger/70 group-invalid:text-danger-fg group-invalid:ring-danger/20',
                  ],
                  isInvalid && 'inset-ring-danger/70 bg-danger/20 text-danger-fg ring-danger/20',
                  isDisabled && 'bg-bluegray-50 cursor-not-allowed',
                  isSelected && isDisabled && 'before:bg-bluegray-300',
                ])}
              />
              {content}
            </div>
          )
        }
      )}
    </RadioPrimitive>
  )
}

export type { RadioGroupProps, RadioProps }
export { Radio, RadioGroup }
