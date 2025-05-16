import { Field, ServerConfig } from '@repo/drizzlify'

import { AutoField } from '../../components/auto-field'
import { Form } from '../../components/form'
import { SubmitButton } from '../../components/submit-button'

interface CreateViewProps<TServerConfig extends ServerConfig> {
  slug: string
  serverConfig: TServerConfig
}

export async function CreateView<TServerConfig extends ServerConfig>(
  props: CreateViewProps<TServerConfig>
) {
  const collection = props.serverConfig.collections.find(
    (collection) => collection.slug === props.slug
  )
  if (!collection) throw new Error(`Collection ${props.slug} not found`)

  return (
    <Form slug={props.slug} method="create">
      <div className="flex flex-col items-center max-w-md gap-y-4 mx-auto">
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
        <SubmitButton>Create</SubmitButton>
      </div>
    </Form>
  )
}
