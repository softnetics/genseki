'use client'

import { type ReactNode, startTransition, useMemo } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { EnvelopeIcon } from '@phosphor-icons/react'

import {
  BaseIcon,
  Button,
  Checkbox,
  type CheckboxProps,
  DatePicker,
  type DatePickerProps,
  FormField,
  FormItemController,
  NumberField,
  type NumberFieldProps,
  RichTextEditor,
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
} from '@genseki/react'

import type { FieldRelationShapeClient, FieldShapeClient } from '../../../../core/field'
import { constructEditorProviderProps } from '../../../../core/richtext'
import type { EditorProviderClientProps } from '../../../../core/richtext/types'
import { useStorageAdapter } from '../../../providers/root'
import { cn } from '../../../utils/cn'
import { convertDateStringToCalendarDate, convertDateStringToTimeValue } from '../../../utils/date'
import { FileUploadField, type FileUploadFieldProps } from '../file-upload-field'

export function AutoFileUploadField(props: FileUploadFieldProps) {
  const { field, error } = useFormItemController()

  return (
    <FileUploadField
      {...props}
      value={field.value}
      onUploadSuccess={(fileKey) => {
        field.onChange(fileKey)
      }}
      onRemoveSuccess={() => {
        field.onChange(null)
      }}
      errorMessage={error?.message}
    />
  )
}

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

export function AutoPasswordField(props: TextFieldProps) {
  const { field, error } = useFormItemController()

  return (
    <TextField
      {...props}
      {...field}
      type="password"
      isRevealable
      errorMessage={error?.message}
      className={cn('w-full', props.className)}
    />
  )
}

export function AutoEmailField(props: TextFieldProps) {
  const { field, error } = useFormItemController()

  return (
    <TextField
      type="email"
      prefix={<BaseIcon icon={EnvelopeIcon} size="sm" />}
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
      onChange={(value) => {
        const validValue = !isNaN(value) ? value : null
        field.onChange(validValue)
      }}
      value={field.value}
      errorMessage={error?.message}
      className={cn('w-full', props.className)}
    />
  )
}

export function AutoSwitch(props: SwitchProps & { label?: string }) {
  const { field, id } = useFormItemController()

  return (
    <div className="pgap-y-4">
      <Switch {...props} {...field} className={props.className} isSelected={field.value} id={id} />
    </div>
  )
}

export function AutoCheckbox(props: CheckboxProps) {
  const { field } = useFormItemController()

  return (
    <div className="py-6">
      <Checkbox {...props} {...field} className={props.className} isSelected={field.value} />
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
      <SelectTrigger className="h-auto" />
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

const AutoRichTextField = (props: {
  name: string
  label?: string
  description?: string
  isRequired?: boolean
  placeholder?: string
  disabled?: boolean
  isPending?: boolean
  errorMessage?: string
  editor: EditorProviderClientProps
}) => {
  const { field, error } = useFormItemController()

  const storageAdapter = useStorageAdapter()

  const editorProviderProps = useMemo(
    () => constructEditorProviderProps(props.editor, storageAdapter),
    []
  )

  return (
    <RichTextEditor
      label={props.label}
      errorMessage={error?.message}
      isRequired={props.isRequired}
      isDisabled={props.disabled}
      description={props.description}
      editorProviderProps={{
        ...editorProviderProps,
        onUpdate(updateCb) {
          startTransition(() => {
            field.onChange(updateCb.editor.getJSON())
          })
          editorProviderProps.onUpdate?.(updateCb)
        },
        content: field.value,
      }}
    />
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
  fieldShape: FieldShapeClient
  optionsRecord: Record<string, any[]>
  className?: string
  prefix?: string
  disabled?: boolean
}

export function AutoField(props: AutoFieldProps) {
  const { fieldShape: field, className } = props

  if (props.fieldShape.hidden) return null

  const disabled = props.fieldShape.disabled || props.disabled

  const commonProps = {
    name: props.prefix ? `${props.prefix}.${field.$client}` : field.$client.fieldName,
    label: field.label,
    className: className,
    description: field.description,
    placeholder: field.placeholder,
    isRequired: field.required,
  }

  switch (field.type) {
    case 'richText':
      return (
        <AutoFormField
          key={commonProps.name}
          name={commonProps.name}
          component={
            <AutoRichTextField
              {...commonProps}
              // TODO: Fix this
              editor={field.editor as EditorProviderClientProps}
              disabled={disabled}
            />
          }
        />
      )
    case 'text':
      return (
        <AutoFormField
          key={commonProps.name}
          name={commonProps.name}
          component={<AutoTextField {...commonProps} isDisabled={disabled} />}
        />
      )
    case 'password':
      return (
        <AutoFormField
          key={commonProps.name}
          name={commonProps.name}
          component={<AutoPasswordField {...commonProps} isDisabled={disabled} />}
        />
      )
    case 'email':
      return (
        <AutoFormField
          key={commonProps.name}
          name={commonProps.name}
          component={<AutoEmailField {...commonProps} isDisabled={disabled} />}
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
          component={<AutoTimeField {...commonProps} isDisabled={disabled} />}
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
      const options = props.optionsRecord[field.$client.fieldName] ?? []
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
      const options = props.optionsRecord[field.$client.fieldName] ?? []
      return (
        <select name={field.$client.fieldName}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    case 'media': {
      return (
        <AutoFormField
          key={commonProps.name}
          name={commonProps.name}
          component={
            <AutoFileUploadField
              {...commonProps}
              uploadOptions={field.uploadOptions}
              isDisabled={disabled}
            />
          }
        />
      )
    }

    case 'create':
      return (
        <AutoRelationshipField
          name={field.$client.fieldName}
          fieldShape={field}
          allowCreate={true}
          allowConnect={false}
          optionsRecord={props.optionsRecord}
          disabled={disabled}
        />
      )
    case 'connect':
      return (
        <AutoRelationshipField
          name={field.$client.fieldName}
          fieldShape={field}
          allowConnect={true}
          allowCreate={false}
          optionsRecord={props.optionsRecord}
          disabled={disabled}
        />
      )
    case 'connectOrCreate':
      return (
        <AutoRelationshipField
          name={field.$client.fieldName}
          fieldShape={field}
          allowConnect={true}
          allowCreate={true}
          optionsRecord={props.optionsRecord}
          disabled={disabled}
        />
      )

    default:
      throw new Error(`Unsupported field type: ${JSON.stringify(field)}`)
  }
}

interface AutoRelationshipFieldProps {
  name: string
  // NOTE: This should be FieldClient but the type is not correct
  fieldShape: FieldRelationShapeClient
  optionsRecord: Record<string, any[]>
  className?: string
  allowCreate?: boolean
  allowConnect?: boolean
  disabled?: boolean
}

export function AutoRelationshipField(props: AutoRelationshipFieldProps) {
  if (props.fieldShape.hidden) {
    return null
  }

  switch (props.fieldShape.$client.relation.isList) {
    case false:
      return (
        <AutoOneRelationshipField
          name={props.name}
          fieldShape={props.fieldShape}
          optionsRecord={props.optionsRecord}
          className={props.className}
          allowCreate={props.allowCreate}
          allowConnect={props.allowConnect}
          disabled={props.disabled}
        />
      )
    case true:
      return (
        <AutoManyRelationshipField
          name={props.name}
          fieldShape={props.fieldShape}
          optionsRecord={props.optionsRecord}
          className={props.className}
          allowCreate={props.allowCreate}
          allowConnect={props.allowConnect}
          disabled={props.disabled}
        />
      )
    default:
      throw new Error(`Unsupported relationship mode: "${(props.fieldShape.$client as any).mode}"`)
  }
}

export function AutoOneRelationshipField(props: AutoRelationshipFieldProps) {
  const { control } = useFormContext()

  if (props.fieldShape.hidden) return null
  const disabled = props.fieldShape.disabled || false

  const commonProps = {
    label: props.fieldShape.label,
    className: props.className,
    description: props.fieldShape.description,
    placeholder: props.fieldShape.placeholder,
  }

  const connectComponent = (
    <FormField
      name={`${props.name}.connect`}
      control={control}
      render={({ field, fieldState, formState }) => (
        <FormItemController field={field} fieldState={fieldState} formState={formState}>
          <AutoSelectField
            {...commonProps}
            items={props.optionsRecord[props.fieldShape.$client.fieldName] ?? []}
            isDisabled={disabled}
          />
        </FormItemController>
      )}
    />
  )

  const createComponent = Object.entries(props.fieldShape.fields).map(([key, originalField]) => (
    <AutoFormField
      key={`${props.name}.create.${originalField.$client.fieldName}`}
      name={`${props.name}.create.${originalField.$client.fieldName}`}
      component={
        <AutoField
          key={key}
          fieldShape={originalField as FieldShapeClient}
          className="w-full"
          optionsRecord={props.optionsRecord}
          prefix={`${props.name}.create`}
          disabled={disabled}
        />
      }
    />
  ))

  switch (props.fieldShape.type) {
    case 'connect':
      return (
        <div className="p-6 bg-muted rounded-lg flex flex-col gap-y-4 border border-red-500">
          <div>{props.fieldShape.label}</div>
          {connectComponent}
        </div>
      )
    case 'create':
      return (
        <div className="p-6 bg-muted rounded-lg flex flex-col gap-y-4 border border-red-500">
          <div>{props.fieldShape.label}</div>
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
  fieldShape: FieldRelationShapeClient
  optionsRecord: Record<string, any[]>
  className?: string
  allowCreate?: boolean
  allowConnect?: boolean
  disabled?: boolean
}

export function AutoManyRelationshipField(props: AutoManyRelationshipFieldProps) {
  const { control } = useFormContext()
  const fieldArray = useFieldArray({
    control: control,
    name: props.name,
  })

  if (props.fieldShape.hidden) return null
  const disabled = props.fieldShape.disabled || props.disabled

  const connectComponent = (name: string) => {
    const commonProps = {
      label: props.fieldShape.label,
      className: props.className,
      description: props.fieldShape.description,
      placeholder: props.fieldShape.placeholder,
    }
    return (
      <AutoFormField
        name={name}
        component={
          <AutoSelectField
            {...commonProps}
            items={props.optionsRecord[props.fieldShape.$client.fieldName] ?? []}
            isDisabled={disabled}
          />
        }
      />
    )
  }

  const createComponent = (name: string) => {
    return Object.entries(props.fieldShape.fields).map(([key, childField]) => (
      <AutoFormField
        key={key}
        name={name}
        component={
          <AutoField
            fieldShape={childField as FieldShapeClient}
            className="w-full"
            optionsRecord={props.optionsRecord}
            prefix={name}
            disabled={disabled}
          />
        }
      />
    ))
  }

  switch (props.fieldShape.type) {
    case 'connect':
      return (
        <div className="border border-red-500 p-6">
          {fieldArray.fields.map((fieldValue, index) => (
            <div key={fieldValue.id} className="p-6 bg-muted rounded-lg flex flex-col gap-y-4">
              <div>
                {props.fieldShape.label} #{index + 1}
              </div>
              {connectComponent(`${props.name}.${index}.connect`)}
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
                {props.fieldShape.label} #{index + 1}
              </div>
              {createComponent(`${props.name}.${index}.create`)}
            </div>
          ))}
          <Button
            type="button"
            variant="primary"
            size="sm"
            isDisabled={disabled}
            onClick={() => fieldArray.append({})}
          >
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
                {props.fieldShape.label} #{index + 1}
              </div>
              {connectComponent(`${props.name}.${index}.connect`)}
              {createComponent(`${props.name}.${index}.create`)}
            </div>
          ))}
          <Button
            type="button"
            variant="primary"
            size="sm"
            isDisabled={disabled}
            onClick={() => fieldArray.append({})}
          >
            Add
          </Button>
        </div>
      )
  }
}
