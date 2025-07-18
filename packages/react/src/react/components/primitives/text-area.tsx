'use client'

import { TextArea, TextField, type TextFieldProps } from 'react-aria-components'

import { twJoin } from 'tailwind-merge'

import { Description, FieldError, type FieldProps, Label } from './field'
import { composeTailwindRenderProps } from './primitive'

interface TextareaProps extends Omit<TextFieldProps, 'className'>, FieldProps {
  className?: string | ((v: TextFieldProps) => string)
}

const Textarea = ({
  className,
  placeholder,
  label,
  description,
  errorMessage,
  ...props
}: TextareaProps) => {
  return (
    <TextField
      {...props}
      className={composeTailwindRenderProps(
        className,
        'group flex flex-col gap-y-1 *:data-[slot=label]:font-medium'
      )}
    >
      {label && (
        <Label>
          {label} {props.isRequired && <span className="ml-1 text-pumpkin-500">*</span>}
        </Label>
      )}
      <TextArea
        placeholder={placeholder}
        className={composeTailwindRenderProps(
          className,
          twJoin([
            'field-sizing-content max-h-96 min-h-64 w-full min-w-0 rounded-lg border border-input py-6 px-7 text-base placeholder-muted-fg shadow-xs outline-hidden transition duration-200',
            'focus:border-ring/70 focus:ring-3 focus:ring-ring/20',
            'focus:invalid:border-danger/70 focus:invalid:ring-3 focus:invalid:ring-danger/20',
            'invalid:border-red-500',
            'disabled:bg-muted disabled:forced-colors:border-[GrayText] disabled:cursor-not-allowed',
            'hover:border-current/20 invalid:hover:border-danger/70',
          ])
        )}
      />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  )
}

export type { TextareaProps }
export { Textarea }
