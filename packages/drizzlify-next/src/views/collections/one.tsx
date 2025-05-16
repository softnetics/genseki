import { ServerConfig } from '@repo/drizzlify'

interface OneViewProps<TServerConfig extends ServerConfig> {
  id: string
  slug: string
  serverConfig: TServerConfig
}

export async function OneView<TServerConfig extends ServerConfig>(
  props: OneViewProps<TServerConfig>
) {
  const collection = props.serverConfig.collections.find(
    (collection) => collection.slug === props.slug
  )
  if (!collection) throw new Error(`Collection ${props.slug} not found`)

  const result = await collection.admin.api.findOne({
    context: { ...props.serverConfig.context, db: props.serverConfig.db },
    slug: props.slug,
    fields: collection.fields,
    id: props.id,
  })

  return <div>{JSON.stringify(result)}</div>
}
