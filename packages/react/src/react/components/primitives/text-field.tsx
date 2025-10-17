'use client'

import * as React from 'react'
import { useState } from 'react'
import type {
  InputProps as ReactAriaInputPrimitiveProps,
  TextFieldProps as TextFieldPrimitiveProps,
} from 'react-aria-components'
import { TextField as TextFieldPrimitive } from 'react-aria-components'
import { useFormStatus } from 'react-dom'

import { CopyIcon, EyeClosedIcon, EyeIcon } from '@phosphor-icons/react'
import { tv, type VariantProps } from 'tailwind-variants'

import { Button } from './button'
import type { FieldProps } from './field'
import {
  Description as Description,
  FieldError as FieldError,
  FieldGroup as FieldGroup,
  Input,
  Label as Label,
} from './field'
import { Loader } from './loader'

import { BaseIcon } from '../../components/primitives/base-icon'
import { Typography } from '../../components/primitives/typography'
import { cn } from '../../utils/cn'

type InputType = Exclude<ReactAriaInputPrimitiveProps['type'], 'password'>

interface BaseTextFieldProps extends TextFieldPrimitiveProps, FieldProps {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  isPending?: boolean
  className?: string
  isShowHttp?: boolean
  isShowCopyButton?: boolean
}

interface RevealableTextFieldProps extends BaseTextFieldProps {
  isRevealable: true
  type: 'password'
}

interface NonRevealableTextFieldProps extends BaseTextFieldProps {
  isRevealable?: never
  type?: InputType
}

const fieldgroupVariants = tv({
  base: 'bg-bg box-content rounded-md',
  variants: {
    size: {
      lg: `[&>input]:py-6 px-2 [&>[data-slot=prefix]]:pl-4 [&>[data-slot=suffix]]:pr-4`,
      md: `[&>input]:py-4 px-2 [&>[data-slot=prefix]]:pl-2 [&>[data-slot=suffix]]:pr-2`,
      sm: `[&>input]:py-3 px-2 [&>[data-slot=prefix]]:pl-1 [&>[data-slot=suffix]]:pr-1`,
      xs: `[&>input]:py-2 px-1 [&>[data-slot=prefix]]:pl-1 [&>[data-slot=suffix]]:pr-1`,
    },
  },
  defaultVariants: { size: 'md' },
})

/**
 * @deprecated use InputProps
 */
type TextFieldProps = (RevealableTextFieldProps | NonRevealableTextFieldProps) &
  VariantProps<typeof fieldgroupVariants>

/**
 * @deprecated use Input
 */
const TextField = ({
  placeholder,
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  isPending,
  className,
  isRevealable,
  type,
  ...props
}: TextFieldProps) => {
  const formStatus = useFormStatus()
  const disabled = formStatus.pending || props.isDisabled

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const inputType = isRevealable ? (isPasswordVisible ? 'text' : 'password') : type
  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev)
  }

  const isInvalid = !!errorMessage || !!props.isInvalid

  return (
    <TextFieldPrimitive
      type={inputType}
      {...props}
      className="group flex flex-col gap-y-4"
      isInvalid={isInvalid}
      isDisabled={disabled}
    >
      {!props.children ? (
        <>
          {label && (
            <Label>
              {label} {props.isRequired && <span className="ml-1 text-text-brand">*</span>}
            </Label>
          )}
          <FieldGroup
            isDisabled={disabled}
            isInvalid={isInvalid}
            data-loading={isPending ? 'true' : undefined}
            className={cn(fieldgroupVariants({ size: props.size, className }))}
          >
            {props.isShowHttp && (
              <div className="border-r border-border mr-1 flex items-center p-6">
                <Typography type="caption" weight="medium" className="text-bluegray-400">
                  http://
                </Typography>
              </div>
            )}
            {prefix && typeof prefix === 'string' ? (
              <Typography
                data-slot="prefix"
                type="caption"
                weight="medium"
                className="text-text-secondary"
              >
                {prefix}
              </Typography>
            ) : (
              prefix && <div data-slot="prefix">{prefix}</div>
            )}
            <Input placeholder={placeholder} disabled={disabled} />
            {isRevealable ? (
              <Button
                variant="vanish"
                size="md"
                type="button"
                aria-label="Toggle password visibility"
                onPress={handleTogglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <BaseIcon icon={EyeClosedIcon} weight="regular" size="md" />
                ) : (
                  <BaseIcon icon={EyeIcon} weight="regular" size="md" />
                )}
              </Button>
            ) : isPending ? (
              <Loader variant="spin" />
            ) : suffix ? (
              typeof suffix === 'string' ? (
                <Typography
                  data-slot="suffix"
                  type="caption"
                  weight="medium"
                  className="text-text-secondary"
                >
                  {suffix}
                </Typography>
              ) : (
                <div data-slot="suffix">{suffix}</div>
              )
            ) : null}
            {props.isShowCopyButton && (
              <div className="border-l border-border ml-1 flex items-center gap-2">
                <Button
                  variant="vanish"
                  size="md"
                  type="button"
                  onPress={() => {
                    navigator.clipboard.writeText(props.value ?? '')
                  }}
                  className="flex items-center gap-2"
                >
                  <BaseIcon icon={CopyIcon} size="md" weight="regular" />
                  Copy
                </Button>
              </div>
            )}
          </FieldGroup>
          {description && <Description>{description}</Description>}
          <FieldError>{errorMessage}</FieldError>
        </>
      ) : (
        props.children
      )}
    </TextFieldPrimitive>
  )
}

export { TextField, type TextFieldProps }
