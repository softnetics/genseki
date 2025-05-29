'use client'

import { useFormContext } from 'react-hook-form'

import type { Field, FieldRelation } from '@kivotos/core'

import { Checkbox, type CheckboxProps } from '../../intentui/ui/checkbox'
import { DatePicker, type DatePickerProps } from '../../intentui/ui/date-picker'
import { FieldError, Label } from '../../intentui/ui/field'
import { FormField, FormItemController, useFormItemController } from '../../intentui/ui/form'
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
      selectedKey={field.value}
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

interface AutoFieldProps {
  name: string
  // NOTE: This should be FieldClient but the type is not correct
  field: Field & { fieldName: string }
  optionsRecord: Record<string, any[]>
  className?: string
  visibilityField?: 'create' | 'update'
}

export function AutoField(props: AutoFieldProps) {
  const { control } = useFormContext()

  const visibility = props.visibilityField ? props.field[props.visibilityField] : 'enabled'
  if (visibility === 'hidden') {
    return null
  }

  return (
    <FormField
      key={props.name}
      name={props.name}
      control={control}
      render={({ field, fieldState, formState }) => (
        <FormItemController field={field} fieldState={fieldState} formState={formState}>
          <_AutoField {...props} />
        </FormItemController>
      )}
    />
  )
}

function _AutoField(props: AutoFieldProps) {
  const { field, className } = props

  const visibility = props.visibilityField ? props.field[props.visibilityField] : 'enabled'
  if (visibility === 'hidden') {
    return null
  }
  const disabled = visibility === 'disabled'

  const commonProps = {
    name: field.fieldName,
    label: field.label,
    className: className,
    description: field.description,
    placeholder: field.placeholder,
  }

  switch (field.type) {
    case 'text':
      return <AutoTextField {...commonProps} isDisabled={disabled} />
    case 'number':
      return <AutoNumberField {...commonProps} isDisabled={disabled} />
    case 'time':
      return <AutoTimeField {...commonProps} isDisabled={disabled} />
    case 'date':
      return <AutoDatePickerField {...commonProps} isDisabled={disabled} />
    case 'checkbox':
      return <AutoCheckbox {...commonProps} isDisabled={disabled} />
    case 'switch':
      return <AutoSwitch {...commonProps} isDisabled={disabled} />
    case 'selectText': {
      const options = props.optionsRecord[field.fieldName] ?? []
      return <AutoSelectField {...commonProps} items={options} isDisabled={disabled} />
    }
    case 'selectNumber': {
      const options = props.optionsRecord[field.fieldName] ?? []
      return <AutoSelectField {...commonProps} items={options} isDisabled={disabled} />
    }
    case 'comboboxText': {
      const options = props.optionsRecord[field.fieldName] ?? []
      return (
        <select name={field._.column.name}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }
    case 'comboboxNumber': {
      const options = props.optionsRecord[field.fieldName] ?? []
      return 'TODO'
    }
    case 'comboboxBoolean': {
      return <p>COMBOBOX BOOLEAN</p>
    }
    case 'media': {
      return <p>MEDIA</p>
    }

    case 'create':
      return (
        <AutoRelationShipField
          name={field.fieldName}
          field={field}
          allowCreate={true}
          allowConnect={false}
          optionsRecord={props.optionsRecord}
          visibilityField={props.visibilityField}
        />
      )
    case 'connect':
      return (
        <AutoRelationShipField
          name={field.fieldName}
          field={field}
          allowConnect={true}
          allowCreate={false}
          optionsRecord={props.optionsRecord}
          visibilityField={props.visibilityField}
        />
      )
    case 'connectOrCreate':
      return (
        <AutoRelationShipField
          name={field.fieldName}
          field={field}
          allowConnect={true}
          allowCreate={true}
          optionsRecord={props.optionsRecord}
          visibilityField={props.visibilityField}
        />
      )

    default:
      throw new Error(`Unsupported field type: ${JSON.stringify(field)}`)
  }
}

interface AutoRelationShipFieldProps {
  name: string
  // NOTE: This should be FieldClient but the type is not correct
  field: FieldRelation & { fieldName: string }
  optionsRecord: Record<string, any[]>
  className?: string
  allowCreate?: boolean
  allowConnect?: boolean
  visibilityField?: 'create' | 'update'
}

export function AutoRelationShipField(props: AutoRelationShipFieldProps) {
  const { control } = useFormContext()
  const visibility = props.visibilityField ? props.field[props.visibilityField] : 'enabled'
  if (visibility === 'hidden') {
    return null
  }
  const disabled = visibility === 'disabled'

  const commonProps = {
    label: props.field.label,
    className: props.className,
    description: props.field.description,
    placeholder: props.field.placeholder,
  }

  return (
    <div className="p-6 bg-muted rounded-lg flex flex-col gap-y-4">
      {props.allowConnect && (
        // TODO: Clean up this shit. It's hacked
        <FormField
          name={`${props.name}.connect`}
          control={control}
          render={({ field, fieldState, formState }) => (
            <FormItemController field={field} fieldState={fieldState} formState={formState}>
              <AutoSelectField
                {...commonProps}
                items={props.optionsRecord[props.field.fieldName] ?? []}
                isDisabled={disabled}
              />
            </FormItemController>
          )}
        />
      )}
      {props.allowCreate && (
        <div className="flex flex-col gap-y-2 bg-yellow-500 p-4  rounded-lg">
          {Object.entries(props.field.fields).map(([key, field]) => (
            <AutoField
              key={key}
              name={`${props.name}.${field.fieldName}.create`}
              field={field}
              className="w-full"
              optionsRecord={props.optionsRecord}
              visibilityField={props.visibilityField}
            />
          ))}
        </div>
      )}
    </div>
  )
}
