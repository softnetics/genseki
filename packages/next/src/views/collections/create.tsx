import type { Field, ServerConfig } from '@kivotos/core'

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

  console.log(
    Object.entries(collection.fields).map(([fName, fValue]) => [fName, fValue]),
    'Form fields 📝'
  )

  return (
    <Form slug={props.slug} method="create">
      <div className="mx-auto flex max-w-md flex-col gap-y-4 mt-24">
        {Object.entries(collection.fields).map(([key, field]) => {
          return <AutoField key={key} field={field as Field} serverConfig={props.serverConfig} />
        })}
        <SubmitButton>Create</SubmitButton>
      </div>
    </Form>
  )
}
