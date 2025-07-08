import { CreateClientView } from './create.client'
import { CollectionFormLayout } from './layouts/collection-form-layout'

import { type ServerConfig } from '../../../core'
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
  const context = props.serverConfig.context.toRequestContext({
    headers: headersValue,
  })

  const optionsRecord = await createOptionsRecord(context, collection.fields)

  return (
    <CollectionFormLayout size="md">
      <Typography type="h2" weight="semibold">
        Create new {props.slug}
      </Typography>
      <CreateClientView slug={props.slug} optionsRecord={optionsRecord} />
    </CollectionFormLayout>
  )
}
