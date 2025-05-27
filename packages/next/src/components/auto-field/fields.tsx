'use client'
import { Controller, type Path, useFormContext } from 'react-hook-form'

import { Checkbox, type CheckboxProps } from '../../intentui/ui/checkbox'
import { Label } from '../../intentui/ui/field'
import { NumberField, type NumberFieldProps } from '../../intentui/ui/number-field'
import { Switch, type SwitchProps } from '../../intentui/ui/switch'
import { TextField, type TextFieldProps } from '../../intentui/ui/text-field'
import { cn } from '../../utils/cn'

/**
 * TODO:
 * - Is required
 */

export const AutoTextField = <TFormType extends Record<string, any>>(
  props: TextFieldProps & Required<Pick<TextFieldProps, 'name'>>
) => {
  const { control } = useFormContext<TFormType>()

  return (
    <Controller
      name={props.name as Path<TFormType>}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            type="text"
            onChange={(value) => field.onChange(value)}
            label={props.label}
            placeholder={props.placeholder}
            errorMessage={error?.message}
            {...props}
            className={cn('w-full', props.className)}
            name={field.name}
          />
        )
      }}
    />
  )
}

export const AutoNumberField = <TFormType extends Record<string, any>>(
  props: NumberFieldProps & Required<Pick<NumberFieldProps, 'name'>>
) => {
  const { control } = useFormContext<TFormType>()

  return (
    <Controller
      name={props.name as Path<TFormType>}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <NumberField
            onChange={(value) => field.onChange(value)}
            label={props.label}
            placeholder={props.placeholder}
            errorMessage={error?.message}
            {...props}
            className={cn('w-full', props.className)}
            name={field.name}
          />
        )
      }}
    />
  )
}

export const AutoSwitch = <TFormType extends Record<string, any>>(
  props: SwitchProps & Required<Pick<SwitchProps, 'name'>> & { label?: string }
) => {
  const { control } = useFormContext<TFormType>()

  return (
    <div className="flex items-center gap-x-4 bg-muted p-6 rounded-md">
      <Controller
        name={props.name as Path<TFormType>}
        control={control}
        render={({ field }) => (
          <>
            <Label htmlFor={`switch-${field.name}`} className="select-none">
              {props.label ?? field.name /* Switch label is requried anyway */}
            </Label>
            <Switch
              id={`switch-${props.name}`}
              {...props}
              className={cn('', props.className)}
              name={field.name}
            />
          </>
        )}
      />
    </div>
  )
}

export const AutoCheckbox = <TFormType extends Record<string, any>>(
  props: CheckboxProps & Required<Pick<SwitchProps, 'name'>>
) => {
  const { control } = useFormContext<TFormType>()
  return (
    <div className="py-6">
      <Controller
        name={props.name as Path<TFormType>}
        control={control}
        render={({ field }) => (
          <Checkbox
            label={props.label}
            {...props}
            className={cn('', props.className)}
            name={field.name}
          />
        )}
      />
    </div>
  )
}
