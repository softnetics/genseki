'use client'

import { type ReactNode, startTransition, useMemo } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import { EnvelopeIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'

import {
  BaseIcon,
  Button,
  Checkbox,
  type CheckboxProps,
  DatePicker,
  type DatePickerProps,
  FormField,
  FormItemController,
  Label,
  NumberField,
  type NumberFieldProps,
  RichTextEditor,
  Select,
  SelectLabel,
  SelectList,
  SelectOption,
  type SelectProps,
  SelectTrigger,
  Separator,
  Switch,
  type SwitchProps,
  TextField,
  type TextFieldProps,
  TimeField,
  type TimeFieldProps,
  Typography,
  useFormItemController,
} from '@genseki/react'

import type {
  FieldOptionsCallbackReturn,
  FieldRelationShapeClient,
  FieldsClient,
  FieldShapeClient,
} from '../../../../core/field'
import { constructEditorProviderProps } from '../../../../core/richtext'
import type { EditorProviderClientProps } from '../../../../core/richtext/types'
import { useDebounce } from '../../../hooks/use-debounce'
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

interface AutoSelectField extends Omit<SelectProps<{}>, 'items'> {
  optionsName: string
  optionsFetchPath: string
}

export function AutoSelectField(props: AutoSelectField) {
  const { field, error } = useFormItemController()

  const form = useFormContext()

  const value = useWatch({
    control: form.control,
  })

  const query = useQuery<{ status: 200; body: FieldOptionsCallbackReturn }>({
    queryKey: ['POST', props.optionsFetchPath, { pathParams: { name: props.optionsName } }],
    queryFn: async () => {
      const response = await fetch(`/api${props.optionsFetchPath}?name=${props.optionsName}`, {
        method: 'POST',
        body: JSON.stringify(value),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to fetch options')
      return response.json()
    },
    enabled: false,
  })

  useDebounce(value, () => query.refetch(), 500)

  const items = query.data?.body.options ?? []
  const isDisabled = query.data?.body.disabled ?? props.isDisabled

  return (
    <Select
      {...field}
      aria-label={props.label}
      items={items}
      isDisabled={isDisabled}
      selectedKey={field.value}
      className={cn('w-full', props.className)}
      errorMessage={error?.message}
      onOpenChange={(isOpen) => {
        if (isOpen) query.refetch()
      }}
      onSelectionChange={(value) => {
        if (value === null) return field.onChange(null)
        if (value === field.value) return field.onChange(null)

        const selectedItem = items.find((item) => item.value === value)
        if (selectedItem) {
          field.onChange(selectedItem.value)
        } else {
          field.onChange(value)
        }
      }}
    >
      {props.label && (
        <Label>
          {props.label} {props.isRequired && <span className="ml-1 text-text-brand">*</span>}
        </Label>
      )}
      <SelectTrigger className="h-auto" isPending={query.isLoading} />
      <SelectList items={items}>
        {(item) => (
          <SelectOption key={item.value} id={item.value} textValue={item.label}>
            <SelectLabel>{item.label}</SelectLabel>
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

export interface AutoFieldProps {
  fieldShape: FieldShapeClient

  optionsFetchPath?: string

  className?: string
  prefix?: string
  disabled?: boolean
}

export function AutoField(props: AutoFieldProps) {
  const { fieldShape: field, className } = props

  if (props.fieldShape.hidden) return null

  const disabled = props.fieldShape.disabled || props.disabled

  const commonProps = {
    name: props.prefix
      ? `${props.prefix}.${props.fieldShape.$client.fieldName}`
      : props.fieldShape.$client.fieldName,
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
      if (!props.optionsFetchPath) throw new Error('Missing optionsFetchPath')

      return (
        <AutoFormField
          key={commonProps.name}
          name={commonProps.name}
          component={
            <AutoSelectField
              {...commonProps}
              isDisabled={disabled}
              optionsName={field.options}
              optionsFetchPath={props.optionsFetchPath}
            />
          }
        />
      )
    }

    case 'comboboxNumber':
    case 'comboboxText': {
      return (
        <select name={field.$client.fieldName}>
          {([] as any[]).map((option) => (
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
              hintText={field.hintText}
              isDisabled={disabled}
            />
          }
        />
      )
    }

    case 'create':
    case 'connect':
    case 'connectOrCreate': {
      if (!props.optionsFetchPath) throw new Error('Missing optionsFetchPath')

      return (
        <AutoRelationshipField
          name={commonProps.name}
          fieldShape={field}
          allowConnect={field.type === 'connect' || field.type === 'connectOrCreate'}
          allowCreate={field.type === 'create' || field.type === 'connectOrCreate'}
          disabled={disabled}
          optionsFetchPath={props.optionsFetchPath}
        />
      )
    }

    default:
      throw new Error(`Unsupported field type: ${JSON.stringify(field)}`)
  }
}

interface AutoRelationshipFieldProps {
  name: string
  fieldShape: FieldRelationShapeClient

  optionsFetchPath: string

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
          className={props.className}
          allowCreate={props.allowCreate}
          allowConnect={props.allowConnect}
          disabled={props.disabled}
          optionsFetchPath={props.optionsFetchPath}
        />
      )
    case true:
      return (
        <AutoManyRelationshipField
          name={props.name}
          fieldShape={props.fieldShape}
          className={props.className}
          allowCreate={props.allowCreate}
          allowConnect={props.allowConnect}
          disabled={props.disabled}
          optionsFetchPath={props.optionsFetchPath}
        />
      )
    default:
      throw new Error(`Unsupported relationship mode: "${(props.fieldShape.$client as any).mode}"`)
  }
}

export function AutoOneRelationshipField(props: AutoRelationshipFieldProps) {
  const { control } = useFormContext()

  const fieldShape = props.fieldShape

  if (fieldShape.hidden) return null
  const disabled = fieldShape.disabled || false

  const commonProps = {
    label: fieldShape.label,
    className: props.className,
    description: fieldShape.description,
    placeholder: fieldShape.placeholder,
  }

  const connectComponent = (name: string, options: string) => (
    <FormField
      key={name}
      name={name}
      control={control}
      render={({ field, fieldState, formState }) => (
        <FormItemController field={field} fieldState={fieldState} formState={formState}>
          <AutoSelectField
            {...commonProps}
            isDisabled={disabled}
            optionsFetchPath={props.optionsFetchPath}
            optionsName={options}
          />
        </FormItemController>
      )}
    />
  )

  const createComponent = Object.entries(fieldShape.fields).map(([key, originalField]) => (
    <AutoFormField
      key={`${props.name}.create.${originalField.$client.fieldName}`}
      name={`${props.name}.create.${originalField.$client.fieldName}`}
      component={
        <AutoField
          key={key}
          fieldShape={originalField as FieldShapeClient}
          className="w-full"
          prefix={`${props.name}.create`}
          disabled={disabled}
          optionsFetchPath={props.optionsFetchPath}
        />
      }
    />
  ))

  switch (fieldShape.type) {
    case 'connect':
      return (
        <div className="rounded-md border border-border bg-surface-tertiary overflow-hidden">
          {fieldShape.label && (
            <>
              <Typography
                type="caption"
                weight="normal"
                className="px-6 py-2 text-text-brand bg-surface-brand-soft-1 w-full"
              >
                {fieldShape.label}
              </Typography>
              <Separator className="border-border-brand" />
            </>
          )}
          <div className="p-6">{connectComponent(`${props.name}.connect`, fieldShape.options)}</div>
        </div>
      )
    case 'create':
      return (
        <div className="">
          <div>{fieldShape.label}</div>
          {createComponent}
        </div>
      )
    case 'connectOrCreate':
      return (
        <div className="p-6 bg-muted rounded-lg flex flex-col gap-y-4 border border-red-500">
          {connectComponent(`${props.name}.connect`, fieldShape.options)}
          <div className="flex flex-col gap-y-2 bg-surface-accent-hover p-4 rounded-lg">
            {createComponent}
          </div>
        </div>
      )
  }
}

interface AutoManyRelationshipFieldProps {
  name: string
  fieldShape: FieldRelationShapeClient

  optionsFetchPath: string

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

  const fieldShape = props.fieldShape

  if (fieldShape.hidden) return null
  const disabled = fieldShape.disabled || props.disabled

  const connectComponent = (name: string, options: string) => {
    const commonProps = {
      label: fieldShape.label,
      className: props.className,
      description: fieldShape.description,
      placeholder: fieldShape.placeholder,
    }
    return (
      <AutoFormField
        name={name}
        component={
          <AutoSelectField
            {...commonProps}
            isDisabled={disabled}
            optionsName={options}
            optionsFetchPath={props.optionsFetchPath}
          />
        }
      />
    )
  }

  const createComponent = (name: string) => {
    return Object.entries(fieldShape.fields).map(([key, childField]) => (
      <AutoFormField
        key={key}
        name={name}
        component={
          <AutoField
            fieldShape={childField as FieldShapeClient}
            className="w-full"
            prefix={name}
            disabled={disabled}
            optionsFetchPath={props.optionsFetchPath}
          />
        }
      />
    ))
  }

  switch (fieldShape.type) {
    case 'connect':
      return (
        <div className="rounded-md border border-input p-6 grid grid-cols-1 gap-y-6">
          {!!fieldArray.fields.length && (
            <div className="flex flex-col gap-y-6">
              {fieldArray.fields.map((fieldValue, index) => (
                <div key={fieldValue.id} className="p-6 bg-muted rounded-lg flex flex-col gap-y-4">
                  <div>
                    {fieldShape.label} #{index + 1}
                  </div>
                  {connectComponent(`${props.name}.${index}.connect`, fieldShape.options)}
                </div>
              ))}
            </div>
          )}
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => fieldArray.append({})}
            className="justify-self-start"
          >
            Add
          </Button>
        </div>
      )
    case 'create':
      return (
        <div className="rounded-md border border-input p-6 grid grid-cols-1 gap-y-6">
          {!!fieldArray.fields.length && (
            <div className="flex flex-col space-y-6">
              {fieldArray.fields.map((fieldValue, index) => (
                <div
                  key={fieldValue.id}
                  className="p-6 bg-surface-tertiary rounded-sm flex flex-col gap-y-4"
                >
                  <Typography type="caption" weight="normal">
                    {fieldShape.label} #{index + 1}
                  </Typography>
                  <div className="flex flex-col">
                    {createComponent(`${props.name}.${index}.create`)}
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            isDisabled={disabled}
            onClick={() => fieldArray.append({})}
            className="justify-self-start"
          >
            Add
          </Button>
        </div>
      )

    case 'connectOrCreate':
      return (
        <div className="rounded-md border border-input shadow-sm p-6">
          {fieldArray.fields.map((fieldValue, index) => (
            <div key={fieldValue.id} className="p-6 bg-muted rounded-lg flex flex-col gap-y-4">
              <div>
                {fieldShape.label} #{index + 1}
              </div>
              {connectComponent(`${props.name}.${index}.connect`, fieldShape.options)}
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

export interface AutoFieldsProps {
  fields: FieldsClient
  optionsFetchPath?: string
  disabled?: boolean
}

export function AutoFields(props: AutoFieldsProps) {
  return (
    <>
      {Object.values(props.fields.shape).map((fieldShape) => (
        <AutoField
          key={fieldShape.$client.fieldName}
          fieldShape={fieldShape}
          optionsFetchPath={props.optionsFetchPath}
          disabled={props.disabled}
        />
      ))}
    </>
  )
}
