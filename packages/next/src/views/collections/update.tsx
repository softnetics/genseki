import type { Field, ServerConfig } from '@kivotos/core'

import { AutoField } from '../../components/auto-field'
import { Form } from '../../components/form'
import { SubmitButton } from '../../components/submit-button'

interface UpdateViewProps<TServerConfig extends ServerConfig> {
  slug: string
  identifier: string
  serverConfig: TServerConfig
}

// TODO: Fetch default values
export function UpdateView<TServerConfig extends ServerConfig>(
  props: UpdateViewProps<TServerConfig>
) {
  const collection = props.serverConfig.collections[props.slug]

  if (!collection) throw new Error(`Collection ${props.slug} not found`)

  return (
    <Form slug={props.slug} method="update" id={props.identifier}>
      {Object.entries(collection.fields).map(([key, field]) => {
        return (
          <AutoField
            key={key}
            name={key}
            field={field as Field}
            serverConfig={props.serverConfig}
          />
        )
      })}
      <SubmitButton>Update</SubmitButton>
    </Form>
  )
}
