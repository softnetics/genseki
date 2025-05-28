import type { Fields, ServerConfig } from '@kivotos/core'

import { CreateClientView } from './create.client'

import { AutoField } from '../../components/auto-field'
import { Typography } from '../../components/primitives/typography'

interface CreateViewProps<TServerConfig extends ServerConfig> {
  slug: string
  serverConfig: TServerConfig
}

export async function CreateView<TServerConfig extends ServerConfig>(
  props: CreateViewProps<TServerConfig>
) {
  const collection = props.serverConfig.collections[props.slug]

  if (!collection) throw new Error(`Collection ${props.slug} not found`)

  const inputFieldsPromises = Object.values(collection.fields as Fields<any>).flatMap(
    async (field) => {
      if (field.create === 'hidden') return []
      return [
        {
          name: field.fieldName,
          input: await AutoField({
            field,
            serverConfig: props.serverConfig,
            visibility: field.create,
          }),
        },
      ]
    }
  )

  const inputFields = (await Promise.all(inputFieldsPromises)).flat()

  return (
    <div className="mx-auto flex max-w-md w-full flex-col gap-y-4 mt-24">
      <Typography type="h1" weight="semibold">
        Create new {props.slug}
      </Typography>
      <CreateClientView slug={props.slug} inputFields={inputFields} />
    </div>
  )
}
