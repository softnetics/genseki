'use client'

import { forwardRef } from 'react'
import type {
  ColorFieldProps as ColorFieldPrimitiveProps,
  ValidationResult,
} from 'react-aria-components'
import { ColorField as ColorFieldPrimitive } from 'react-aria-components'

import { twJoin } from 'tailwind-merge'

import { ColorPicker } from './color-picker'
import { ColorSwatch } from './color-swatch'
import { Description, FieldError, FieldGroup, Input, Label } from './field'
import { composeTailwindRenderProps } from './primitive'

import { Typography } from '../../components/primitives/typography'

interface ColorFieldProps extends ColorFieldPrimitiveProps {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  placeholder?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  isLoading?: boolean
  enableColorPicker?: boolean
}

const ColorField = forwardRef<HTMLInputElement, ColorFieldProps>(
  (
    {
      label,
      description,
      errorMessage,
      placeholder,
      prefix,
      suffix,
      isLoading,
      enableColorPicker = true,
      className,
      ...props
    },
    ref
  ) => {
    const value = props.value ?? props.defaultValue

    return (
      <ColorFieldPrimitive
        ref={ref}
        {...props}
        aria-label={props['aria-label'] ?? 'Color field'}
        className={composeTailwindRenderProps(
          className,
          '**:data-[slot=color-swatch]:-ml-0.5 group flex w-full flex-col gap-y-1'
        )}
      >
        {label && <Label>{label}</Label>}
        <FieldGroup data-loading={isLoading ? 'true' : undefined}>
          {prefix && typeof prefix === 'string' ? (
            <Typography
              data-slot="prefix"
              type="caption"
              weight="medium"
              className="ml-2 text-text-secondary"
            >
              {prefix}
            </Typography>
          ) : (
            prefix
          )}
          <div className={twJoin('flex w-full items-center', prefix && 'ml-6')}>
            {value && (
              <span className="ml-4">
                {enableColorPicker ? (
                  <ColorPicker
                    className="*:[button]:size-8 *:[button]:rounded-sm *:[button]:ring-0"
                    onChange={props.onChange}
                    defaultValue={value}
                  />
                ) : (
                  <ColorSwatch className="size-6" color={value.toString('hex')} />
                )}
              </span>
            )}
            <Input placeholder={placeholder} />
          </div>
          {suffix && typeof suffix === 'string' ? (
            <Typography
              data-slot="suffix"
              type="caption"
              weight="medium"
              className="text-text-secondary mr-2"
            >
              {suffix}
            </Typography>
          ) : (
            suffix
          )}
        </FieldGroup>
        {description && <Description>{description}</Description>}
        <FieldError>{errorMessage}</FieldError>
      </ColorFieldPrimitive>
    )
  }
)

export type { ColorFieldProps }
export { ColorField }
