import { CreateClientView } from './create.client'

import { Context, createAuth, type ServerConfig } from '../../../core'
import { createOptionsRecord } from '../../components/compound/auto-field'
import { Typography } from '../../components/primitives/typography'
import { getHeadersObject } from '../../utils/headers'

interface CreateViewProps<TServerConfig extends ServerConfig> {
  slug: string
  headers: Headers
  serverConfig: TServerConfig
}

export async function CreateView<TServerConfig extends ServerConfig>(
  props: CreateViewProps<TServerConfig>
) {
  const collection = props.serverConfig.collections[props.slug]

  if (!collection) throw new Error(`Collection ${props.slug} not found`)

  const headersValue = getHeadersObject(props.headers)
  const { context: authContext } = createAuth(props.serverConfig.auth, props.serverConfig.context)
  const context = Context.toRequestContext(authContext, headersValue)

  const optionsRecord = await createOptionsRecord(context, collection.fields)

  return (
    <div className="mx-auto flex w-full flex-col px-8 lg:px-0 lg:max-w-[640px] gap-y-4 mt-24">
      <Typography type="h1" weight="semibold">
        Create new {props.slug}
      </Typography>
      <CreateClientView slug={props.slug} optionsRecord={optionsRecord} />
    </div>
  )
}
