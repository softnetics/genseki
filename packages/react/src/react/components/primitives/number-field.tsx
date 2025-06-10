'use client'

import {
  Button,
  type ButtonProps,
  NumberField as NumberFieldPrimitive,
  type NumberFieldProps as NumberFieldPrimitiveProps,
  type ValidationResult,
} from 'react-aria-components'

import { CaretDownIcon, CaretUpIcon, MinusIcon, PlusIcon } from '@phosphor-icons/react'
import { tv, type VariantProps } from 'tailwind-variants'

import { Description, FieldError, FieldGroup, Input, Label } from './field'
import { composeTailwindRenderProps } from './primitive'

import { BaseIcon } from '../../components/primitives/base-icon'
import { useMediaQuery } from '../../hooks/use-media-query'
import { cn } from '../../utils/cn'

const fieldBorderStyles = tv({
  base: 'group-focus:border-primary/70 forced-colors:border-[Highlight]',
  variants: {
    isInvalid: {
      true: 'group-focus:border-danger/70 forced-colors:border-[Mark]',
    },
    isDisabled: {
      true: 'group-focus:border-input/70',
    },
  },
})

const fieldgroupVariants = tv({
  base: 'box-content rounded-md',
  variants: {
    size: {
      md: `[&>input]:p-6 [&>[data-slot=prefix]]:pl-4 [&>[data-slot=suffix]]:pr-4`,
      sm: `[&>input]:p-4 [&>[data-slot=prefix]]:pl-2 [&>[data-slot=suffix]]:pr-2`,
      xs: `[&>input]:p-2 [&>[data-slot=prefix]]:pl-2 [&>[data-slot=suffix]]:pr-2`,
    },
  },
  defaultVariants: { size: 'md' },
})

interface NumberFieldProps
  extends NumberFieldPrimitiveProps,
    VariantProps<typeof fieldgroupVariants> {
  label?: string
  description?: string
  placeholder?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
}

const NumberField = ({
  label,
  placeholder,
  description,
  className,
  errorMessage,
  ...props
}: NumberFieldProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const isInvalid = !!errorMessage || !!props.isInvalid
  return (
    <NumberFieldPrimitive
      isInvalid={isInvalid}
      {...props}
      className={composeTailwindRenderProps(className, 'group flex flex-col gap-y-1.5')}
    >
      {label && (
        <Label>
          {label} {props.isRequired && <span className="ml-1 text-red-500">*</span>}
        </Label>
      )}
      <FieldGroup
        className={cn(
          fieldgroupVariants({ size: props.size }),
          'overflow-hidden',
          isMobile && '**:[button]:h-full **:[button]:rounded-none **:[button]:px-4 m-0'
        )}
      >
        {(renderProps) => (
          <>
            {isMobile ? <StepperButton className="border-r h-full " slot="decrement" /> : null}
            <Input className="tabular-nums max-md:text-center" placeholder={placeholder} />
            {!isMobile ? (
              <div
                className={fieldBorderStyles({
                  ...renderProps,
                  className: 'grid self-stretch sm:border-s',
                })}
              >
                <div className="flex h-full flex-col">
                  <StepperButton slot="increment" emblemType="chevron" className="px-2 flex-1" />
                  <div
                    className={fieldBorderStyles({
                      ...renderProps,
                      className: 'border-input border-b',
                    })}
                  />
                  <StepperButton slot="decrement" emblemType="chevron" className="px-2 flex-1" />
                </div>
              </div>
            ) : (
              <StepperButton className="border-l h-full" slot="increment" />
            )}
          </>
        )}
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </NumberFieldPrimitive>
  )
}

interface StepperButtonProps extends ButtonProps {
  slot: 'increment' | 'decrement'
  emblemType?: 'chevron' | 'default'
  className?: string
}

const StepperButton = ({
  slot,
  className,
  emblemType = 'default',
  ...props
}: StepperButtonProps) => {
  const icon =
    emblemType === 'chevron' ? (
      slot === 'increment' ? (
        <BaseIcon icon={CaretUpIcon} size="sm" weight="bold" />
      ) : (
        <BaseIcon icon={CaretDownIcon} size="sm" weight="bold" />
      )
    ) : slot === 'increment' ? (
      <BaseIcon icon={PlusIcon} size="sm" weight="bold" />
    ) : (
      <BaseIcon icon={MinusIcon} size="sm" weight="bold" />
    )
  return (
    <Button
      className={composeTailwindRenderProps(
        className,
        'cursor-default pressed:[&>svg]:text-primary-fg text-muted-fg group-disabled:bg-secondary/70 pressed:bg-primary forced-colors:group-disabled:text-[GrayText]'
      )}
      slot={slot}
      {...props}
    >
      {icon}
    </Button>
  )
}

export type { NumberFieldProps }
export { NumberField }
