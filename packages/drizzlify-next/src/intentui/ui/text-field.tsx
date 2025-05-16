'use client'

import { useState } from 'react'
import type { InputProps, TextFieldProps as TextFieldPrimitiveProps } from 'react-aria-components'
import { TextField as TextFieldPrimitive } from 'react-aria-components'

import { Eye, EyeClosed } from '@phosphor-icons/react'
import { cva, VariantProps } from 'class-variance-authority'

import Typography from '~/components/primitives/typography'
import { cn } from '~/utils/cn'

import { Button } from './button'
import type { FieldProps } from './field'
import { Description, FieldError, FieldGroup, Input, Label } from './field'
import { Loader } from './loader'

type InputType = Exclude<InputProps['type'], 'password'>

interface BaseTextFieldProps extends TextFieldPrimitiveProps, FieldProps {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  isPending?: boolean
  className?: string
}

interface RevealableTextFieldProps extends BaseTextFieldProps {
  isRevealable: true
  type: 'password'
}

interface NonRevealableTextFieldProps extends BaseTextFieldProps {
  isRevealable?: never
  type?: InputType
}

const fieldgroupVariants = cva('box-content rounded-md', {
  variants: {
    size: {
      md: `[&>input]:p-6 [&>[data-slot=prefix]]:pl-4 [&>[data-slot=suffix]]:pr-4`,
      sm: `[&>input]:p-4 [&>[data-slot=prefix]]:pl-2 [&>[data-slot=suffix]]:pr-2`,
      xs: `[&>input]:p-2 [&>[data-slot=prefix]]:pl-2 [&>[data-slot=suffix]]:pr-2`,
    },
  },
  defaultVariants: { size: 'md' },
})

type TextFieldProps = (RevealableTextFieldProps | NonRevealableTextFieldProps) &
  VariantProps<typeof fieldgroupVariants>

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const inputType = isRevealable ? (isPasswordVisible ? 'text' : 'password') : type
  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev)
  }

  return (
    <TextFieldPrimitive type={inputType} {...props} className="group flex flex-col gap-y-1">
      {!props.children ? (
        <>
          {label && (
            <Label>
              {label} {props.isRequired && <span className="ml-1 text-red-500">*</span>}
              {/* Fixed isRequire to isRequired */}
            </Label>
          )}
          <FieldGroup
            isDisabled={props.isDisabled}
            isInvalid={!!errorMessage}
            data-loading={isPending ? 'true' : undefined}
            className={cn(fieldgroupVariants({ size: props.size, className }))}
          >
            {prefix && typeof prefix === 'string' ? (
              <Typography
                data-slot="prefix"
                type="caption"
                weight="medium"
                className="text-text-trivial"
              >
                {prefix}
              </Typography>
            ) : (
              prefix && <div data-slot="prefix">{prefix}</div>
            )}
            <Input placeholder={placeholder} />
            {isRevealable ? (
              <Button
                variant="vanish"
                size="md"
                type="button"
                aria-label="Toggle password visibility"
                onPress={handleTogglePasswordVisibility}
              >
                {isPasswordVisible ? <EyeClosed /> : <Eye />}
              </Button>
            ) : isPending ? (
              <Loader variant="spin" />
            ) : suffix ? (
              typeof suffix === 'string' ? (
                <Typography
                  data-slot="suffix"
                  type="caption"
                  weight="medium"
                  className="text-text-trivial"
                >
                  {suffix}
                </Typography>
              ) : (
                <div data-slot="suffix">{suffix}</div>
              )
            ) : null}
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

export type { TextFieldProps }
export { TextField }
