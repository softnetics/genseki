import type { Field, ServerConfig } from '@kivotos/core'

import { AutoCheckbox, AutoNumberField, AutoSwitch, AutoTextField } from './fields'

import { Select, SelectList, SelectOption, SelectTrigger } from '../../intentui/ui/select'

interface AutoFieldProps<TServerConfig extends ServerConfig> {
  field: Field
  serverConfig: TServerConfig
  className?: string
}

export async function AutoField<TServerConfig extends ServerConfig>(
  props: AutoFieldProps<TServerConfig>
) {
  const { field, className } = props

  switch (field.type) {
    case 'text':
      return (
        <AutoTextField
          name={field._.column.name}
          placeholder={field.placeholder}
          className={className}
          label={field.label}
          defaultValue={field.default}
        />
      )
    case 'number':
      return (
        <AutoNumberField
          name={field._.column.name}
          className={className}
          label={field.label}
          defaultValue={field.default}
        />
      )
    case 'time':
      return (
        <AutoTextField
          type="time"
          name={field._.column.name}
          className={className}
          label={field.label}
          defaultValue={field.default?.toTimeString().split(' ')[0]}
        />
      )
    case 'date':
      return (
        <AutoTextField
          type="date"
          name={field._.column.name}
          className={className}
          label={field.label}
          defaultValue={field.default?.toISOString().split('T')[0]}
        />
      )
    case 'checkbox':
      return (
        <AutoCheckbox
          name={field._.column.name}
          className={className}
          defaultSelected={field.default}
          label={field.label}
          description={field.description}
        />
      )
    case 'switch':
      return (
        <AutoSwitch
          name={field._.column.name}
          className={className}
          label={field.label}
          defaultSelected={field.default}
        />
      )
    case 'selectText': {
      const options = await field.options({ db: props.serverConfig.db })

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
      const options = await field.options({ db: props.serverConfig.db })
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
      const options = await field.options({ db: props.serverConfig.db })
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
      const options = await field.options({ db: props.serverConfig.db })
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
