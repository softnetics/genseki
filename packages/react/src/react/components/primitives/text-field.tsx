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

import { AriaButton } from './button'
import type { AriaFieldProps } from './field'
import {
  AriaDescription as AriaDescription,
  AriaFieldError as AriaFieldError,
  AriaFieldGroup as AriaFieldGroup,
  AriaInput,
  AriaLabel as AriaLabel,
} from './field'
import { Loader } from './loader'

import { BaseIcon } from '../../components/primitives/base-icon'
import { Typography } from '../../components/primitives/typography'
import { cn } from '../../utils/cn'

type AriaInputType = Exclude<ReactAriaInputPrimitiveProps['type'], 'password'>

interface AriaBaseTextFieldProps extends TextFieldPrimitiveProps, AriaFieldProps {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  isPending?: boolean
  className?: string
  isShowHttp?: boolean
  isShowCopyButton?: boolean
}

interface AriaRevealableTextFieldProps extends AriaBaseTextFieldProps {
  isRevealable: true
  type: 'password'
}

interface AriaNonRevealableTextFieldProps extends AriaBaseTextFieldProps {
  isRevealable?: never
  type?: AriaInputType
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
type AriaTextFieldProps = (AriaRevealableTextFieldProps | AriaNonRevealableTextFieldProps) &
  VariantProps<typeof fieldgroupVariants>

/**
 * @deprecated use Input
 */
const AriaTextField = ({
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
}: AriaTextFieldProps) => {
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
            <AriaLabel>
              {label} {props.isRequired && <span className="ml-1 text-text-brand">*</span>}
            </AriaLabel>
          )}
          <AriaFieldGroup
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
            <AriaInput placeholder={placeholder} disabled={disabled} />
            {isRevealable ? (
              <AriaButton
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
              </AriaButton>
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
                <AriaButton
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
                </AriaButton>
              </div>
            )}
          </AriaFieldGroup>
          {description && <AriaDescription>{description}</AriaDescription>}
          <AriaFieldError>{errorMessage}</AriaFieldError>
        </>
      ) : (
        props.children
      )}
    </TextFieldPrimitive>
  )
}

export { AriaTextField, type AriaTextFieldProps }

/**
 *
 * Shadcn component
 *
 */

function Input({
  className,
  type,
  isError,
  ...props
}: React.ComponentProps<'input'> & { isError?: boolean }) {
  return (
    <input
      type={type}
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-18 w-full min-w-0 rounded-md border bg-transparent px-6 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-14 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      data-slot="input"
      aria-invalid={isError}
      {...props}
    />
  )
}

type InputProps = React.ComponentPropsWithRef<typeof Input>

export { Input, type InputProps }
