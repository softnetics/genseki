import { headers } from 'next/headers'

import { Context, createAuth, type ServerConfig } from '@kivotos/core'

import { getHeadersObject } from '../../utils/headers'

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

  const headersValue = getHeadersObject(await headers())

  const { context: authContext } = createAuth(props.serverConfig.auth, props.serverConfig.context)
  const context = Context.toRequestContext(authContext, headersValue)

  const result = await collection.admin.api.findOne({
    context,
    slug: props.slug,
    fields: collection.fields,
    id: props.identifier,
  })

  return <div>{JSON.stringify(result)}</div>
}
