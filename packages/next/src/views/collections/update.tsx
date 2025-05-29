import type { Fields, ServerConfig } from '@kivotos/core'

import { UpdateClientView } from './update.client'

import { AutoField } from '../../components/auto-field'
import { Typography } from '../../components/primitives/typography'

interface UpdateViewProps<TServerConfig extends ServerConfig> {
  identifier: string
  slug: string
  serverConfig: TServerConfig
}

export async function UpdateView<TServerConfig extends ServerConfig>(
  props: UpdateViewProps<TServerConfig>
) {
  const collection = props.serverConfig.collections[props.slug]
  if (!collection) throw new Error(`Collection ${props.slug} not found`)

  const result = await collection.admin.api.findOne({
    context: { ...props.serverConfig.context, db: props.serverConfig.db },
    slug: props.slug,
    fields: collection.fields,
    id: props.identifier,
  })

  const inputFieldsPromises = Object.values(collection.fields as Fields<any>).flatMap(
    async (field) => {
      if (field.update === 'hidden') return []
      return [
        {
          name: field.fieldName,
          input: await AutoField({
            field,
            serverConfig: props.serverConfig,
            visibility: field.update,
          }),
        },
      ]
    }
  )

  const inputFields = (await Promise.all(inputFieldsPromises)).flat()

  return (
    <div className="mx-auto flex max-w-md w-full flex-col gap-y-4 mt-24">
      <Typography type="h1" weight="semibold">
        Update {props.slug}
      </Typography>
      <UpdateClientView
        identifer={props.identifier}
        slug={props.slug}
        inputFields={inputFields}
        defaultValues={result}
      />
    </div>
  )
}
