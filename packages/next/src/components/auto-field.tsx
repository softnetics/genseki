import { ServerConfig } from '~/core/config'
import { Field } from '~/core/field'

import { Checkbox } from '../intentui/ui/checkbox'
import { Select, SelectList, SelectOption, SelectTrigger } from '../intentui/ui/select'
import { Switch } from '../intentui/ui/switch'
import { TextField } from '../intentui/ui/text-field'

interface AutoFieldProps<TServerConfig extends ServerConfig> {
  name: string
  field: Field
  serverConfig: TServerConfig
}

export async function AutoField<TServerConfig extends ServerConfig>(
  props: AutoFieldProps<TServerConfig>
) {
  const { field, name } = props

  switch (field.type) {
    case 'text':
      return (
        <TextField
          name={name}
          type="text"
          className="w-full"
          label={field.label ?? name}
          placeholder={field.placeholder ?? name}
        />
      )
    case 'number':
      return <input type="number" name={name} />
    case 'date':
      return <input type="date" name={name} />
    case 'checkbox':
      return <Checkbox name={name} children={field.label ?? name} />
    case 'switch':
      return <Switch name={name} children={field.label ?? name} />
    case 'selectText': {
      const options = await field.options(props.serverConfig)
      return (
        <Select name={name} placeholder={field.placeholder ?? name} label={field.label ?? name}>
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
      const options = await field.options(props.serverConfig)
      return (
        <Select name={name} placeholder={field.placeholder ?? name} label={field.label ?? name}>
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
      const options = await field.options(props.serverConfig)
      return (
        <select name={name}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }
    case 'comboboxNumber': {
      const options = await field.options(props.serverConfig)
      return (
        <select name={name}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }
    default:
      throw new Error(`Unsupported field type: ${field.type}`)
  }
}
