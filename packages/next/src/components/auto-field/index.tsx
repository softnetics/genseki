import { headers } from 'next/headers'

import { Context, createAuth, type Field, type ServerConfig } from '@kivotos/core'

import {
  AutoCheckbox,
  AutoDatePickerField,
  AutoNumberField,
  AutoSelectField,
  AutoSwitch,
  AutoTextField,
  AutoTimeField,
} from './fields'

import { getHeadersObject } from '../../utils/headers'

interface AutoFieldProps<TServerConfig extends ServerConfig> {
  field: Field
  serverConfig: TServerConfig
  className?: string
  visibility?: 'hidden' | 'enabled' | 'disabled'
}

export async function AutoField<TServerConfig extends ServerConfig>(
  props: AutoFieldProps<TServerConfig>
) {
  const { field, className } = props

  const headersValue = getHeadersObject(await headers())
  const { context: authContext } = createAuth(props.serverConfig.auth, props.serverConfig.context)

  const context = Context.toRequestContext(authContext, headersValue)

  if (props.visibility === 'hidden') {
    return null
  }

  const disabled = props.visibility === 'disabled'

  const commonProps = {
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
      const options = await field.options(context)
      return <AutoSelectField {...commonProps} items={options} isDisabled={disabled} />
    }
    case 'selectNumber': {
      const options = await field.options(context)
      return <AutoSelectField {...commonProps} items={options} isDisabled={disabled} />
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
