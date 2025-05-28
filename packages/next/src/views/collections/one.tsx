import { type ServerConfig } from '@kivotos/core'

interface OneViewProps<TServerConfig extends ServerConfig> {
  slug: string
  identifier: string
  serverConfig: TServerConfig
}

export async function OneView<TServerConfig extends ServerConfig>(
  props: OneViewProps<TServerConfig>
) {
  const collection = props.serverConfig.collections[props.slug]

  if (!collection) throw new Error(`Collection ${props.slug} not found`)

  const result = await collection.admin.api.findOne({
    context: props.serverConfig.context,
    requestContext: props.serverConfig.context.toRequestContext(),
    slug: props.slug,
    fields: collection.fields,
    id: props.identifier,
  })

  return <div>{JSON.stringify(result)}</div>
}
