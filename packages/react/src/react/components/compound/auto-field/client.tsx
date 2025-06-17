'use client'

import type { ReactNode } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import type { Field, FieldRelation } from '../../../../core'
import type { AnyContext } from '../../../../core/context'
import { cn } from '../../../utils/cn'
import { convertDateStringToCalendarDate, convertDateStringToTimeValue } from '../../../utils/date'
import {
  Button,
  Checkbox,
  type CheckboxProps,
  DatePicker,
  type DatePickerProps,
  FieldError,
  FormField,
  FormItemController,
  Label,
  NumberField,
  type NumberFieldProps,
  Select,
  SelectList,
  SelectOption,
  type SelectProps,
  SelectTrigger,
  Switch,
  type SwitchProps,
  TextField,
  type TextFieldProps,
  TimeField,
  type TimeFieldProps,
  useFormItemController,
} from '../../primitives'

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

export function AutoFormField(props: { name: string; component: ReactNode }) {
  const { control } = useFormContext()
  return (
    <FormField
      key={props.name}
      name={props.name}
      control={control}
      render={({ field, fieldState, formState }) => (
        <FormItemController field={field} fieldState={fieldState} formState={formState}>
          {props.component}
        </FormItemController>
      )}
    />
  )
}

interface AutoFieldProps {
  // NOTE: This should be FieldClient but the type is not correct
  field: Field<any, AnyContext> & { fieldName: string }
  optionsRecord: Record<string, any[]>
  className?: string
  visibilityField?: 'create' | 'update'
  prefix?: string
}

export function AutoField(props: AutoFieldProps) {
  const { field, className } = props

  const visibility = props.visibilityField ? props.field[props.visibilityField] : 'enabled'
  if (visibility === 'hidden') {
    return null
  }
  const disabled = visibility === 'disabled'

  const commonProps = {
    name: props.prefix ? `${props.prefix}.${field.fieldName}` : field.fieldName,
    label: field.label,
    className: className,
    description: field.description,
    placeholder: field.placeholder,
  }

  switch (field.type) {
    case 'text':
      return (
        <AutoFormField
          key={commonProps.name}
          name={commonProps.name}
          component={<AutoTextField {...commonProps} isDisabled={disabled} />}
        />
      )

    case 'number':
      return (
        <AutoFormField
          key={commonProps.name}
          name={commonProps.name}
          component={<AutoNumberField {...commonProps} isDisabled={disabled} />}
        />
      )

    case 'time':
      return (
        <AutoFormField
          key={commonProps.name}
          name={commonProps.name}
          component={<AutoNumberField {...commonProps} isDisabled={disabled} />}
        />
      )

    case 'date':
      return (
        <AutoFormField
          key={commonProps.name}
          name={commonProps.name}
          component={<AutoDatePickerField {...commonProps} isDisabled={disabled} />}
        />
      )

    case 'checkbox':
      return (
        <AutoFormField
          key={commonProps.name}
          name={commonProps.name}
          component={<AutoCheckbox {...commonProps} isDisabled={disabled} />}
        />
      )

    case 'switch':
      return (
        <AutoFormField
          key={commonProps.name}
          name={commonProps.name}
          component={<AutoSwitch {...commonProps} isDisabled={disabled} />}
        />
      )

    case 'selectNumber':
    case 'selectText': {
      const options = props.optionsRecord[field.fieldName] ?? []
      return (
        <AutoFormField
          key={commonProps.name}
          name={commonProps.name}
          component={<AutoSelectField {...commonProps} items={options} isDisabled={disabled} />}
        />
      )
    }

    case 'comboboxNumber':
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

    case 'comboboxBoolean': {
      return <p>COMBOBOX BOOLEAN</p>
    }
    case 'media': {
      return <p>MEDIA</p>
    }

    case 'create':
      return (
        <AutoRelationshipField
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
        <AutoRelationshipField
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
        <AutoRelationshipField
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

interface AutoRelationshipFieldProps {
  name: string
  // NOTE: This should be FieldClient but the type is not correct
  field: FieldRelation & { fieldName: string }
  optionsRecord: Record<string, any[]>
  className?: string
  allowCreate?: boolean
  allowConnect?: boolean
  visibilityField?: 'create' | 'update'
}

export function AutoRelationshipField(props: AutoRelationshipFieldProps) {
  const visibility = props.visibilityField ? props.field[props.visibilityField] : 'enabled'
  if (visibility === 'hidden') {
    return null
  }

  switch (props.field.mode) {
    case 'one':
      return (
        <AutoOneRelationshipField
          name={props.name}
          field={props.field}
          optionsRecord={props.optionsRecord}
          className={props.className}
          allowCreate={props.allowCreate}
          allowConnect={props.allowConnect}
          visibilityField={props.visibilityField}
        />
      )
    case 'many':
      return (
        <AutoManyRelationshipField
          name={props.name}
          field={props.field}
          optionsRecord={props.optionsRecord}
          className={props.className}
          allowCreate={props.allowCreate}
          allowConnect={props.allowConnect}
          visibilityField={props.visibilityField}
        />
      )
    default:
      throw new Error(`Unsupported relationship mode: ${props.field.mode}`)
  }
}

export function AutoOneRelationshipField(props: AutoRelationshipFieldProps) {
  const { control } = useFormContext()
  const visibility = props.visibilityField ? props.field[props.visibilityField] : 'enabled'
  if (visibility === 'hidden') return null
  const disabled = visibility === 'disabled'

  const commonProps = {
    label: props.field.label,
    className: props.className,
    description: props.field.description,
    placeholder: props.field.placeholder,
  }

  const connectComponent = (
    <FormField
      name={props.name}
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
  )

  const createComponent = Object.entries(props.field.fields).map(([key, originalField]) => (
    <AutoFormField
      key={`${props.name}.create.${originalField.fieldName}`}
      name={`${props.name}.create.${originalField.fieldName}`}
      component={
        <AutoField
          key={key}
          field={originalField}
          className="w-full"
          optionsRecord={props.optionsRecord}
          visibilityField={props.visibilityField}
          prefix={`${props.name}.create`}
        />
      }
    />
  ))

  switch (props.field.type) {
    case 'connect':
      return (
        <div className="p-6 bg-muted rounded-lg flex flex-col gap-y-4 border border-red-500">
          <div>{props.field.label}</div>
          {connectComponent}
        </div>
      )
    case 'create':
      return (
        <div className="p-6 bg-muted rounded-lg flex flex-col gap-y-4 border border-red-500">
          <div>{props.field.label}</div>
          {createComponent}
        </div>
      )
    case 'connectOrCreate':
      return (
        <div className="p-6 bg-muted rounded-lg flex flex-col gap-y-4 border border-red-500">
          {connectComponent}
          <div className="flex flex-col gap-y-2 bg-yellow-500 p-4 rounded-lg">
            {createComponent}
          </div>
        </div>
      )
  }
}

interface AutoManyRelationshipFieldProps {
  name: string
  // NOTE: This should be FieldClient but the type is not correct
  field: FieldRelation & { fieldName: string }
  optionsRecord: Record<string, any[]>
  className?: string
  allowCreate?: boolean
  allowConnect?: boolean
  visibilityField?: 'create' | 'update'
}

export function AutoManyRelationshipField(props: AutoManyRelationshipFieldProps) {
  const { control } = useFormContext()
  const fieldArray = useFieldArray({
    control: control,
    name: props.name,
  })
  const visibility = props.visibilityField ? props.field[props.visibilityField] : 'enabled'
  if (visibility === 'hidden') return null
  const disabled = visibility === 'disabled'

  const connectComponent = (name: string) => {
    const commonProps = {
      label: props.field.label,
      className: props.className,
      description: props.field.description,
      placeholder: props.field.placeholder,
    }
    return (
      <AutoFormField
        name={name}
        component={
          <AutoSelectField
            {...commonProps}
            items={props.optionsRecord[props.field.fieldName] ?? []}
            isDisabled={disabled}
          />
        }
      />
    )
  }

  const createComponent = (name: string) => {
    console.log('createComponent', name, props.field.fields)
    return Object.entries(props.field.fields).map(([key, childField]) => (
      <AutoFormField
        key={key}
        name={name}
        component={
          <AutoField
            field={childField}
            className="w-full"
            optionsRecord={props.optionsRecord}
            visibilityField={props.visibilityField}
            prefix={name}
          />
        }
      />
    ))
  }

  switch (props.field.type) {
    case 'connect':
      return (
        <div className="border border-red-500 p-6">
          {fieldArray.fields.map((fieldValue, index) => (
            <div key={fieldValue.id} className="p-6 bg-muted rounded-lg flex flex-col gap-y-4">
              <div>
                {props.field.label} #{index + 1}
              </div>
              {Object.entries(props.field.fields).map(([key, field]) =>
                connectComponent(`${props.name}.${field.fieldName}.${index}.connect`)
              )}
            </div>
          ))}
          <Button type="button" variant="primary" size="sm" onClick={() => fieldArray.append({})}>
            Add
          </Button>
        </div>
      )
    case 'create':
      return (
        <div className="border border-red-500 p-6">
          {fieldArray.fields.map((fieldValue, index) => (
            <div key={fieldValue.id} className="p-6 bg-muted rounded-lg flex flex-col gap-y-4">
              <div>
                {props.field.label} #{index + 1}
              </div>
              {Object.entries(props.field.fields).map(([key, field]) =>
                createComponent(`${props.name}.${field.fieldName}.${index}.create`)
              )}
            </div>
          ))}
          <Button type="button" variant="primary" size="sm" onClick={() => fieldArray.append({})}>
            Add
          </Button>
        </div>
      )

    case 'connectOrCreate':
      return (
        <div className="border border-red-500 p-6">
          {fieldArray.fields.map((fieldValue, index) => (
            <div key={fieldValue.id} className="p-6 bg-muted rounded-lg flex flex-col gap-y-4">
              <div>
                {props.field.label} #{index + 1}
              </div>
              {Object.entries(props.field.fields).map(([key, field]) =>
                connectComponent(`${props.name}.${field.fieldName}.${index}.connect`)
              )}
              {Object.entries(props.field.fields).map(([key, field]) =>
                createComponent(`${props.name}.${field.fieldName}.${index}.create`)
              )}
            </div>
          ))}
          <Button type="button" variant="primary" size="sm" onClick={() => fieldArray.append({})}>
            Add
          </Button>
        </div>
      )
  }
}
