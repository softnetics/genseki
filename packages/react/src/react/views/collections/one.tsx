import { type ServerConfig } from '../../../core'
import { getHeadersObject } from '../../utils/headers'

interface OneViewProps<TServerConfig extends ServerConfig> {
  slug: string
  headers: Headers
  identifier: string
  serverConfig: TServerConfig
}

export async function OneView<TServerConfig extends ServerConfig>(
  props: OneViewProps<TServerConfig>
) {
  const collection = props.serverConfig.collections[props.slug]
  if (!collection) throw new Error(`Collection ${props.slug} not found`)
  const headersValue = getHeadersObject(props.headers)
  const context = props.serverConfig.context.toRequestContext({
    headers: headersValue,
  })

  const result = await collection.admin.endpoints.findOne.handler({
    context,
    pathParams: {
      id: props.identifier,
    },
  })

  return <div>{JSON.stringify(result)}</div>
}
