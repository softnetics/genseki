'use client'

import { Checkbox, type CheckboxProps } from '../../intentui/ui/checkbox'
import { DatePicker, type DatePickerProps } from '../../intentui/ui/date-picker'
import { FieldError, Label } from '../../intentui/ui/field'
import { useFormItemController } from '../../intentui/ui/form'
import { NumberField, type NumberFieldProps } from '../../intentui/ui/number-field'
import {
  Select,
  SelectList,
  SelectOption,
  type SelectProps,
  SelectTrigger,
} from '../../intentui/ui/select'
import { Switch, type SwitchProps } from '../../intentui/ui/switch'
import { TextField, type TextFieldProps } from '../../intentui/ui/text-field'
import { TimeField, type TimeFieldProps } from '../../intentui/ui/time-field'
import { cn } from '../../utils/cn'
import { convertDateStringToCalendarDate, convertDateStringToTimeValue } from '../../utils/date'

export function AutoTextField(props: TextFieldProps) {
  const { field, error } = useFormItemController()

  return (
    <TextField
      type="text"
      {...props}
      {...field}
      errorMessage={error?.message}
      className={cn('w-full', props.className)}
    />
  )
}

export function AutoNumberField(props: NumberFieldProps) {
  const { field, error } = useFormItemController()

  return (
    <NumberField
      {...props}
      {...field}
      errorMessage={error?.message}
      className={cn('w-full', props.className)}
    />
  )
}

export function AutoSwitch(props: SwitchProps & { label?: string }) {
  const { field, error, formItemId } = useFormItemController()

  return (
    <div className="flex items-center gap-x-4 bg-muted p-6 rounded-md">
      <Label htmlFor={formItemId} className="select-none">
        {props.label ?? field.name /* Switch label is requried anyway */}
      </Label>
      <Switch {...props} {...field} className={cn('', props.className)} />
      {error && <FieldError>{error.message}</FieldError>}
    </div>
  )
}

export function AutoCheckbox(props: CheckboxProps) {
  const { field } = useFormItemController()

  return (
    <div className="py-6">
      <Checkbox {...props} {...field} className={cn('', props.className)} />
    </div>
  )
}

export function AutoDatePickerField(
  props: Omit<DatePickerProps<any>, 'defaultValue'> & {
    defaultValue?: string
  }
) {
  const { field, error } = useFormItemController()

  return (
    <DatePicker
      {...props}
      {...field}
      errorMessage={error?.message}
      onChange={(value) => {
        const dateString = value?.toString() || null
        if (dateString === null) return field.onChange(null)
        return field.onChange(dateString)
      }}
      value={convertDateStringToCalendarDate(field.value)}
      defaultValue={convertDateStringToCalendarDate(props.defaultValue)}
    />
  )
}

export function AutoTimeField(
  props: Omit<TimeFieldProps<any>, 'defaultValue'> & {
    defaultValue?: string
  }
) {
  const { field, error } = useFormItemController()

  return (
    <TimeField
      {...props}
      {...field}
      errorMessage={error?.message}
      onChange={(value) => {
        const timeString = value?.toString() || null
        if (timeString === null) return field.onChange(null)
        field.onChange(timeString)
      }}
      defaultValue={convertDateStringToTimeValue(props.defaultValue)}
      value={convertDateStringToTimeValue(field.value)}
    />
  )
}

interface AutoSelectField extends SelectProps<{}> {
  items: { value: string | number; label: string }[]
}

export function AutoSelectField(props: AutoSelectField) {
  const { field, error } = useFormItemController()

  return (
    <Select
      {...field}
      {...props}
      className={cn('w-full', props.className)}
      errorMessage={error?.message}
      onSelectionChange={(value) => {
        if (value === null) return field.onChange(null)
        const selectedItem = props.items?.find((item) => item.value === value)
        if (selectedItem) {
          field.onChange(selectedItem.value)
        } else {
          field.onChange(value)
        }
      }}
    >
      <SelectTrigger />
      <SelectList items={props.items}>
        {(item) => (
          <SelectOption key={item.value} id={item.value} textValue={item.label}>
            {item.label}
          </SelectOption>
        )}
      </SelectList>
    </Select>
  )
}
