import { headers } from 'next/headers'

import { Context, createAuth, type Field, type ServerConfig } from '@kivotos/core'

import {
  AutoCheckbox,
  AutoDatePickerField,
  AutoNumberField,
  AutoSwitch,
  AutoTextField,
  AutoTimeField,
} from './fields'

import { Select, SelectList, SelectOption, SelectTrigger } from '../../intentui/ui/select'
import { getHeadersObject } from '../../utils/headers'

interface AutoFieldProps<TServerConfig extends ServerConfig> {
  field: Field
  serverConfig: TServerConfig
  className?: string
}

export async function AutoField<TServerConfig extends ServerConfig>(
  props: AutoFieldProps<TServerConfig>
) {
  const { field, className } = props
  const headersValue = getHeadersObject(await headers())
  const { context: authContext } = createAuth(props.serverConfig.auth, props.serverConfig.context)

  const context = Context.toRequestContext(authContext, headersValue)

  switch (field.type) {
    case 'text':
      return (
        <AutoTextField
          name={field._.column.name}
          label={field.label}
          className={className}
          placeholder={field.placeholder}
          description={field.description}
        />
      )
    case 'number':
      return (
        <AutoNumberField
          name={field._.column.name}
          label={field.label}
          className={className}
          placeholder={field.placeholder}
          description={field.description}
        />
      )
    case 'time':
      return <AutoTimeField name={field._.column.name} className={className} label={field.label} />
    case 'date':
      return (
        <AutoDatePickerField
          name={field._.column.name}
          label={field.label}
          className={className}
          description={field.description}
        />
      )
    case 'checkbox':
      return (
        <AutoCheckbox
          name={field._.column.name}
          label={field.label}
          className={className}
          description={field.description}
        />
      )
    case 'switch':
      return <AutoSwitch name={field._.column.name} label={field.label} className={className} />
    case 'selectText': {
      const options = await field.options(context)
      return (
        <Select name={field._.column.name} placeholder={field.placeholder} label={field.label}>
          <SelectTrigger />
          <SelectList items={options}>
            {options.map((item) => (
              <SelectOption key={item.value} id={item.value} textValue={item.label}>
                {item.label}
              </SelectOption>
            ))}
          </SelectList>
        </Select>
      )
    }
    case 'selectNumber': {
      const options = await field.options(context)
      return (
        <Select name={field._.column.name} placeholder={field.placeholder} label={field.label}>
          <SelectTrigger />
          <SelectList items={options}>
            {options.map((item) => (
              <SelectOption key={item.value} id={item.value} textValue={item.label}>
                {item.label}
              </SelectOption>
            ))}
          </SelectList>
        </Select>
      )
    }
    case 'comboboxText': {
      const options = await field.options(context)
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
      const options = await field.options(context)
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
    case 'connect':
    case 'connectOrCreate': {
      return <div>x</div>
    }
    default:
      throw new Error(`Unsupported field type: ${JSON.stringify(field)}`)
  }
}
